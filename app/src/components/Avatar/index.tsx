import * as React from 'react';
import {Paragraph} from 'react-native-paper';
import {styles} from "../../theme";
import {View} from "react-native";
import {log, shortName} from "../../lib/functions";

import {ProIcon} from "../index";

const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

export default class Index extends React.Component<any> {


    render() {
        let {label, value, size, fontsize, lineheight, iconName, more}: any = this.props;

        const initials = shortName(label),
            charIndex = initials && initials.charCodeAt(0) - 65,
            colorIndex = Boolean(charIndex>0) ? charIndex % 19 : 1;

        if (!Boolean(size)) {
            size = 35
        }



        return (
            <>
                {value !== '0' && value !== 'Unassigned' && Boolean(value) ? <View style={[styles.bg_global, {
                    borderRadius: 50,
                    width: size,
                    height: size,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors[colorIndex], ...more
                }]}>
                    <View>
                        <Paragraph style={[styles.paragraph, styles.text_xs, {
                            color: 'white',
                            lineHeight: lineheight && lineheight,
                            fontSize: fontsize || 14
                        }]}>{initials}</Paragraph>
                    </View>
                </View> : <ProIcon size={size} color={'#ccc'} name={iconName || 'circle-user'} type={'solid'}/>}
            </>
        );
    }
}
