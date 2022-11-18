import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Component, Fragment } from 'react';
import {OpenENTBackendServiceConfig} from './interface';

interface OpenENTProps {
    info?: OpenENTBackendServiceConfig;
}

export default class extends Component<OpenENTProps & FormComponentProps> {
    render() {
        const {
            form: { getFieldDecorator },
            info,
        } = this.props;

        let initData: Partial<OpenENTBackendServiceConfig> = {};
        if (info) {
            initData = info;
        }
        return (
            <Fragment>
                <Form.Item label="Login">
                    {getFieldDecorator('login', {
                        initialValue: initData.login,
                        rules: [
                            {
                                required: true
                            },
                        ],
                    })(<Input disabled={!!info} />)}
                </Form.Item>
                <Form.Item label="Password">
                    {getFieldDecorator('password', {
                        initialValue: initData.password,
                        rules: [
                            {
                                required: true
                            },
                        ],
                    })(<Input disabled={!!info} type="password" />)}
                </Form.Item>
            </Fragment>
        );
    }
}
