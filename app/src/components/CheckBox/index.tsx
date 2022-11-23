import * as React from 'react';
import {Checkbox, Divider, Paragraph, Text} from 'react-native-paper';
import {log} from "../../lib/functions";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";

const CheckBox = (props:any) => {
    const {editmode=true, description}:any = props;
    const [checked, setChecked] = React.useState(props.value);
    return (
        <View >
            <TouchableOpacity onPress={() => {
                if(editmode) {
                    setChecked(!checked);
                    props.onChange(!checked);
                }
            }} style={[styles.grid,styles.middle]}>
                <Checkbox.Item
                    mode={'android'}
                    position={'leading'}
                    label={props.label}
                    disabled={!editmode}
                    status={(checked) ? 'checked' : 'unchecked'}
                />
                {/*<Paragraph>{props.label}</Paragraph>*/}

            </TouchableOpacity>
            {Boolean(description) && <Text style={[styles.paragraph]}><Text>{description} </Text></Text>}
        </View>
    );
};

export default CheckBox;
