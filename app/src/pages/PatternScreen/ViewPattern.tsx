import React, {Component} from "react";
import {Dimensions} from "react-native";
import Svg, {Circle, Line, Text} from "react-native-svg";

class ViewPattern extends Component<any, any> {

    render() {

        const {pattern, color} = this.props;

        const {width} = Dimensions.get('window');
        const offsetPosition = 68;
        let p1 = offsetPosition, p2 = width - offsetPosition;
        const centerPoint = width / 2;
        const circleRadius = 10;
        const patternString = pattern.split('');
        const circle: any = {
            "1": {cx: p1, cy: p1},
            "2": {cx: centerPoint, cy: p1},
            "3": {cx: p2, cy: p1},
            "4": {cx: p1, cy: centerPoint},
            "5": {cx: centerPoint, cy: centerPoint},
            "6": {cx: p2, cy: centerPoint},
            "7": {cx: p1, cy: p2},
            "8": {cx: centerPoint, cy: p2},
            "9": {cx: p2, cy: p2},
        };
        return (
            <Svg height={width} width={width}>
                {
                    Object.values(circle).map(({cx, cy}: any, index: number) => {
                        return <Circle
                            key={index}
                            cx={cx}
                            cy={cy}
                            r={circleRadius}
                            fill={color || "#111"}
                        />
                    })
                }
                {
                    patternString.map((p: any, current: number) => {
                        let next = current + 1;
                        if (current === (patternString.length - 1)) {
                            next = current;
                        }
                        const currentLineData = circle[patternString[current]];
                        const nextLineData = circle[patternString[next]];
                        return <Line x1={currentLineData.cx} y1={currentLineData.cy} x2={nextLineData.cx}
                                     y2={nextLineData.cy} stroke={color || "#111"} strokeWidth={6}/>
                    })
                }

                {
                    patternString.map((p: any, current: number) => {
                        const currentLineData = circle[patternString[current]];
                        return <Text fontSize={14} fill={"#fff"} fontWeight="bold" x={currentLineData.cx - 4}
                                     y={currentLineData.cy + 5}>
                            {current + 1}
                        </Text>
                    })
                }

            </Svg>
        );
    }
}

export default ViewPattern;
