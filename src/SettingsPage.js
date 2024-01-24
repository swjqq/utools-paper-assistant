import React from 'react'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { textHandlers } from './TextHandlers'
import './SettingsPage.less'

export default class SettingsPage extends React.Component {
    constructor(props) {
        super(props)

        // window.utools.db.remove("settings") // 调试用, 发布注释此句
        const settingDoc = window.utools.db.get('settings') || { activate: {} }

        if (Object.keys(settingDoc.activate).length === 0) {
            Object.keys(textHandlers).forEach(
                key => {
                    textHandlers[key].activate = textHandlers[key].default
                    settingDoc.activate[key] = textHandlers[key].default
                }
            );
        }


        this.state = {
            settingDoc,
        }
    }

    handleSwitchChange = (e) => {
        const settingDoc = JSON.parse(JSON.stringify(this.state.settingDoc))

        textHandlers[e.target.name].activate = e.target.checked
        settingDoc.activate[e.target.name] = e.target.checked

        settingDoc._id = 'settings'
        const result = window.utools.db.put(settingDoc)
        if (result.error) {
            return
        }
        settingDoc._rev = result.rev

        this.setState({ settingDoc })
    }

    handleResetDefault = () => {
        const settingDoc = JSON.parse(JSON.stringify(this.state.settingDoc))

        Object.keys(textHandlers).forEach(
            key => {
                textHandlers[key].activate = textHandlers[key].default
                settingDoc.activate[key] = textHandlers[key].default
            }
        );

        settingDoc._id = 'settings'
        const result = window.utools.db.put(settingDoc)
        if (result.error) {
            return
        }
        settingDoc._rev = result.rev

        this.setState({ settingDoc })
    }

    handleCloseAll = () => {
        const settingDoc = JSON.parse(JSON.stringify(this.state.settingDoc))

        Object.keys(textHandlers).forEach(
            key => {
                textHandlers[key].activate = false
                settingDoc.activate[key] = false
            }
        );

        settingDoc._id = 'settings'
        const result = window.utools.db.put(settingDoc)
        if (result.error) {
            return
        }
        settingDoc._rev = result.rev

        this.setState({ settingDoc })
    }

    handleOpenAll = () => {
        const settingDoc = JSON.parse(JSON.stringify(this.state.settingDoc))

        Object.keys(textHandlers).forEach(
            key => {
                textHandlers[key].activate = true
                settingDoc.activate[key] = true
            }
        );

        settingDoc._id = 'settings'
        const result = window.utools.db.put(settingDoc)
        if (result.error) {
            return
        }
        settingDoc._rev = result.rev

        this.setState({ settingDoc })
    }

    render() {
        const { settingDoc } = this.state

        return (
            <div className='settings-page-container'>
                <div>
                    <IconButton onClick={this.props.onOut} color="primary" size='large' className='btn-close-settings-page'>
                        <CloseIcon size='large' />
                    </IconButton>

                    <FormGroup >
                        {
                            Object.keys(textHandlers).map(key => (
                                <FormControlLabel
                                    key={textHandlers[key].executor}
                                    control={
                                        <Switch checked={settingDoc.activate[key]} onChange={this.handleSwitchChange} name={key} />
                                        // <Switch checked={true} onChange={this.handleSwitchChange} name={key} />
                                    }
                                    label={textHandlers[key].description}
                                />
                            ))
                        }
                    </FormGroup>

                    <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={1}>
                        <Button onClick={this.handleResetDefault} variant='contained'>恢复默认值</Button>
                        <Button onClick={this.handleCloseAll} variant='contained'>全部关闭</Button>
                        <Button onClick={this.handleOpenAll} variant='contained'>全部打开</Button>
                    </Stack>

                </div>
            </div>
        )
    }
}
