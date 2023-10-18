import React from 'react';
import { List, Typography } from 'antd';

const RenderObject = ({ json, title="General information" }) => {
    if (!json) {
        return;
    }
    const listItems = Object.keys(json).map((key) => {
        return (
            <List.Item key={key}>
                <Typography.Title level={5}>{key}</Typography.Title>
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
