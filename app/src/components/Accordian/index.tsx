import * as React from 'react';
import { View, Text } from 'react-native';
import { List } from 'react-native-paper';

const MyComponent = (props:any) => (
    <List.AccordionGroup>

        {props.children}

    </List.AccordionGroup>
);

export default MyComponent;
