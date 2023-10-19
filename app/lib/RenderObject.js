import React from 'react';
import { List, Typography } from 'antd';
import { convertCamelToHuman } from '../util';

const RenderObject = ({ json, keys, title="General information" }) => {
    if (!json) {
        return;
    }

    const objectKeys = keys || Object.keys(json);
    const listItems = objectKeys.map((key) => {
        return (
            <List.Item key={key}>
                <Typography.Title level={5}>{convertCamelToHuman(key)}</Typography.Title>
                <Typography.Text>{json[key]}</Typography.Text>
            </List.Item>
        );
    });

    return (
        <List header={<Typography.Title level={4}>{title}</Typography.Title>}>
            {listItems}
        </List>
    );
};
export default RenderObject;
