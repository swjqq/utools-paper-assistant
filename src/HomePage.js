import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ClearIcon from '@mui/icons-material/Clear';
import Stack from '@mui/material/Stack';
import SettingsIcon from '@mui/icons-material/Settings';

import { textHandlers } from './TextHandlers'
import Settings from './SettingsPage'
import './HomePage.less'


const themeDic = {
  light: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#3f51b5'
      },
      secondary: {
        main: '#f50057'
      }
    }
  }),
  dark: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9'
      },
      secondary: {
        main: '#f48fb1'
      }
    }
  })
}

export default class HomePage extends React.Component {
  state = {
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    inputText: '',
    outputText: '',
    openMessage: false,
    message: { key: 0, type: 'success', body: '' },
    launchSettingsPage: false,
  }


  componentDidMount() {
    window.utools.onPluginEnter(({ code, type, payload }) => {
      document.getElementById('text-input').focus()
      if (type === 'regex') {
        let value = payload.split('pa')[1] // 获取pa后面的字符, pa是关键字, 与plugin.json中的match一致
        this.setState({ inputText: value })

        // 匹配正则表达式不进入handleInputChange, 故直接调用处理输入文本
        let outValue = value
        for (let key in textHandlers) {
          console.log(textHandlers[key])
          if (textHandlers[key].activate) {
            outValue = textHandlers[key].executor(outValue)
          }
        };
        this.setState({ outputText: outValue })

        return
      }
    })
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.setState({ theme: e.matches ? 'dark' : 'light' })
    })
  }

  handleClearInput = () => {
    this.setState({ inputText: '' })
  }

  handleCopyInput = () => {
    const value = document.getElementById('text-input').value

    if (value.length > 0) {
      window.utools.copyText(value)
      this.setState({ openMessage: true, message: { key: Date.now(), type: 'success', body: '已复制输入内容到剪切板' } })
    } else {
      this.setState({ openMessage: true, message: { key: Date.now(), type: 'error', body: '复制失败, 输入内容为空' } })
    }
  }

  handleCutInput = () => {
    const value = document.getElementById('text-input').value
    if (value.length > 0) {
      window.utools.copyText(value)
      this.setState({ inputText: '' })
      this.setState({ openMessage: true, message: { key: Date.now(), type: 'success', body: '已剪切输入内容到剪切板' } })
    } else {
      this.setState({ openMessage: true, message: { key: Date.now(), type: 'error', body: '剪切失败, 输入内容为空' } })
    }
  }

  handleSettingsPageLaunch = () => {
    this.setState({ launchSettingsPage: true })
  }

  handleSettingsOut = () => {
    this.setState({ launchSettingsPage: false })

    // 处理输入文本
    let outValue = this.state.inputText
    for (let key in textHandlers) {
      if (textHandlers[key].activate) {
        outValue = textHandlers[key].executor(outValue)
      }
    };
    this.setState({ outputText: outValue })
  }



  handleInputChange = (event) => {
    let value = event.target.value
    this.setState({ inputText: value })

    // 处理输入文本
    let outValue = value
    for (let key in textHandlers) {
      if (textHandlers[key].activate) {
        outValue = textHandlers[key].executor(outValue)
      }
    };
    this.setState({ outputText: outValue })
  }

  handleOutputChange = (event) => {
    let value = event.target.value
    this.setState({ outputText: value })
  }

  handleClearOutput = () => {
    this.setState({ outputText: '' })
  }

  handleCopyOutput = () => {
    // window.utools.hideMainWindow()
    const value = document.getElementById('text-output').value
    if (value.length > 0) {
      window.utools.copyText(value)
      this.setState({ openMessage: true, message: { key: Date.now(), type: 'success', body: '已复制输出内容到剪切板' } })
    } else {
      this.setState({ openMessage: true, message: { key: Date.now(), type: 'error', body: '复制失败, 输出内容为空' } })
    }
  }

  handleCutOutput = () => {
    // window.utools.hideMainWindow()
    const value = document.getElementById('text-output').value
    if (value.length > 0) {
      window.utools.copyText(value)
      this.setState({ outputText: '' })
      this.setState({ openMessage: true, message: { key: Date.now(), type: 'success', body: '已剪切输出内容到剪切板' } })
    } else {
      this.setState({ openMessage: true, message: { key: Date.now(), type: 'error', body: '剪切失败, 输出内容为空' } })
    }
  }

  handleCloseMessage = () => {
    this.setState({ openMessage: false })
  }

  render() {
    const { theme, inputText, outputText, openMessage, message, launchSettingsPage } = this.state
    if (launchSettingsPage) return <Settings onOut={this.handleSettingsOut} />
    return (
      <ThemeProvider theme={themeDic[theme]}>
        <div className='home-page-container'>
          <div className='input-container'>
            <TextField
              label=''
              id='text-input'
              placeholder='输入文字内容'
              autoFocus
              multiline
              rows={10}
              variant='filled'
              fullWidth
              onChange={this.handleInputChange}
              value={inputText}
            />

            <div className='btn-input-container'>
              <div className='btn-settings-container'>
                <Button onClick={this.handleSettingsPageLaunch} variant="contained" startIcon={<SettingsIcon />}>设置</Button>
              </div>

              <Stack direction="column" justifyContent="space-evenly" alignItems="center" spacing={1}>
                <Button onClick={this.handleCopyInput} variant="contained" startIcon={<ContentCopyIcon />}>复制</Button>
                <Button onClick={this.handleCutInput} variant="contained" startIcon={<ContentCutIcon />}>剪切</Button>
                <Button onClick={this.handleClearInput} variant="contained" startIcon={<ClearIcon />}>清空</Button>
              </Stack>
            </div>
          </div>


          <div className='output-container'>
            <TextField
              label=''
              id='text-output'
              placeholder='输出文字内容'
              // autoFocus
              multiline
              rows={10}
              variant='filled'
              fullWidth
              onChange={this.handleOutputChange}
              value={outputText}
            />

            <div className='btn-output-container'>
              <Stack direction="column" justifyContent="space-evenly" alignItems="center" spacing={1}>
                <Button onClick={this.handleCopyOutput} variant="contained" startIcon={<ContentCopyIcon />}>复制</Button>
                <Button onClick={this.handleCutOutput} variant="contained" startIcon={<ContentCutIcon />}>剪切</Button>
                <Button onClick={this.handleClearOutput} variant="contained" startIcon={<ClearIcon />}>清空</Button>
              </Stack>
            </div>


            <Snackbar
              key={message.key}
              open={openMessage}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              autoHideDuration={3000}
              onClose={this.handleCloseMessage}
            >
              <Alert
                onClose={this.handleCloseMessage}
                variant='filled'
                severity={message.type}
              >{message.body}
              </Alert>
            </Snackbar>
          </div>
        </div>
      </ThemeProvider>)
  }
}
