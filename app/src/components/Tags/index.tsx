import React, {useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {InputBox, ProIcon} from "../index";
import {clone, isEmpty} from "../../lib/functions";
import {styles} from "../../theme";
import {Paragraph} from "react-native-paper";

const Index = ({label, list, onChange}: any) => {

    const [tagValue, setTagValue] = useState("");

    return <View>
        <View style={[styles.tagContainer]}>
            <View style={[styles.tagInputContainer]}>
                <InputBox
                    value={tagValue}
                    label={label}
                    onChange={(value: any) => setTagValue(value)}
                />
            </View>
            <TouchableOpacity
                style={[styles.tagButton]}
                onPress={() => {
                    if (isEmpty(list)) {
                        list = [];
                    }
                    if (tagValue) {
                        list = [
                            ...list,
                            tagValue
                        ]
                        onChange(list)
                    }
                }}>
                <View style={[styles.grid, styles.middle]}>
                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                        Add Tag
                    </Paragraph>
                </View>
            </TouchableOpacity>
        </View>
        <View style={[styles.grid]}>
            {
                !isEmpty(list) && list.map((item: any, index: any) => {
                    return <View
                        key={index}
                        style={[styles.tagItem]}>
                        <Text style={[styles.tagText]}>{item}</Text>
                        <ProIcon
                            name={"times"}
                            size={12}
                            align={"center"}
                            action_type={"button"}
                            color={"white"}
                            onPress={() => {
                                if (!isEmpty(list)) {
                                    let filterData = list.filter((i: any, iIndex: number) => index !== iIndex)
                                    onChange(clone(filterData))
                                }
                            }}
                        />
                    </View>
                })
            }
        </View>
    </View>

    // return <>
    //     <Tags
    //         initialText=""
    //         textInputProps={{
    //             placeholder
    //         }}
    //         initialTags={initialValue || []}
    //         onChangeTags={onChangeTags}
    //         containerStyle={{justifyContent: "flex-start"}}
    //         inputStyle={{
    //             backgroundColor: "#fff",
    //             borderWidth: 1,
    //             borderColor: "#ccc",
    //             borderStyle: "solid"
    //         }}
    //         renderTag={({
    //                         tag,
    //                         index,
    //                         onPress,
    //                         deleteTagOnPress,
    //                         readonly
    //                     }) => (
    //             <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
    //                 <View style={{
    //                     backgroundColor: "#eee",
    //                     margin: 4,
    //                     paddingLeft: 8,
    //                     paddingRight: 8,
    //                     paddingTop: 4,
    //                     paddingBottom: 4,
    //                     borderRadius: 12
    //                 }}><Text>{tag}</Text></View>
    //             </TouchableOpacity>
    //         )}
    //     />
    // </>
}
export default Index;
