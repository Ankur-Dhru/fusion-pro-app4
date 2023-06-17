import * as React from 'react';
import {Paragraph, RadioButton,Text} from 'react-native-paper';
import {styles} from "../../theme";

const MyComponent = (props:any) => {

    const {editmode=true}:any = props;

    const [value, setValue] = React.useState(props.value);

    return (
        <>
            <Text style={[styles.inputLabel]}>{props.label}</Text>
            <RadioButton.Group onValueChange={value => {
                setValue(value);
                props.onChange(value);
            }} value={value}>
                {
                    props.list.map((item:any)=>{
                        return (
                            <RadioButton.Item   label={item.label} disabled={!editmode} value={item.value} style={[styles.m_0,styles.p_0,{marginLeft:-15}]} />
                        )
                    })
                }
            </RadioButton.Group>
        </>
    );
};

export default MyComponent;
