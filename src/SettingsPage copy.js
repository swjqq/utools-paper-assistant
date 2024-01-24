import React from 'react'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { textHandlers } from './TextHandlers'
import './SettingsPage.less'

export default class SettingsPage extends React.Component {
    state = {
    }

    textHandlersKey = []

    constructor(props) {
        super(props)

        for (const key in textHandlers) {
            this.textHandlersKey.push(key)
            this.state[key] = textHandlers[key].activate
        };

        console.log(this.textHandlersKey)
        console.log(this.textHandlersDefault)
    }

    handleSwitchChange = (event) => {
        this.setState({
            [event.target.name]: event.target.checked,
        })
    }

    handleResetDefault = (event) => {
        for (const key of this.textHandlersKey) {
            textHandlers[key].activate = textHandlers[key].default
            this.setState({
                [key]: textHandlers[key].default,
            })
        };
    }

    handleCloseAll = (event) => {
        for (const key of this.textHandlersKey) {
            textHandlers[key].activate = false
            this.setState({
                [key]: false,
            })
        };
    }

    handleOpenAll = (event) => {
        for (const key of this.textHandlersKey) {
            textHandlers[key].activate = true
            this.setState({
                [key]: true,
            })
        };
    }

    render() {
        return (
            <div className='settings-page-container'>
                <div>
                    <IconButton onClick={this.props.onOut} color="primary" size='large' className='btn-close-settings-page'>
                        <CloseIcon size='large' />
                    </IconButton>

                    <FormGroup >
                        {
                            this.textHandlersKey.map(key => (
                                <FormControlLabel
                                    key={textHandlers[key].executor}
                                    control={
                                        <Switch checked={this.state[key]} onChange={this.handleSwitchChange} name={key} />
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
