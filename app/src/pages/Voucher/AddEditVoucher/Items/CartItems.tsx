import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from "../../../../theme";

import {ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Divider, Paragraph, withTheme} from "react-native-paper";
import AddedItems from "./AddedItems";
import {Field} from "react-final-form";
import InputField from "../../../../components/InputField";
import {voucher} from "../../../../lib/setting";
import Tooltip from '../../../../components/Spotlight/Tooltip';
import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {isEmpty} from "../../../../lib/functions";
import {assignOption} from "../../../../lib/static";
import {v4 as uuidv4} from "uuid";


class CartItems extends Component<any> {

    constructor(props: any) {
        super(props);
        this.state={
            option_description:[]
        }
    }

    componentDidMount() {
        if (Boolean(voucher?.settings?.assettype)) {
            requestApi({
                method: methods.get,
                action: actions.tag,
                queryString: {tagtype: 'description'},
                loader: false,
                showlog: true,
                loadertype: 'list'
            }).then((result: any) => {
                if (result.status === SUCCESS && result?.data) {
                    const option_description = !isEmpty(result?.data) && result?.data?.map((k: any) => assignOption(k, k)) || [];
                    this.setState({
                        option_description
                    })
                }
            })
        }
    }

    // cartitem

    render() {

        const {navigation, validate, editmode, theme: {colors}}: any = this.props;
        const {option_description}:any = this.state;

        return (

            <View>


                <View>
                    <AddedItems navigation={navigation} hidetitle={true} editmode={editmode}/>

                    <View>

                        {/*<View>
                             {Boolean(addeditems.length) &&  <Paragraph style={[styles.mb_5,styles.head,styles.bold]}>
                                 Items({addeditems.length})
                                 <ProIcon   name={`ios-chevron-down-sharp`} />
                             </Paragraph> }
                        </View>*/}

                        {editmode && <View>


                            <TouchableOpacity style={[styles.fieldspace]} onPress={() => {
                                navigation.push('SearchItem', {validate: validate, editmode: editmode})
                            }}>

                                <View style={[styles.grid, styles.middle]}>
                                    <ProIcon color={styles.green.color} action_type={'text'}
                                             name={'circle-plus'}/>
                                    <Paragraph
                                        style={[styles.paragraph, styles.text_sm, styles.green, {marginHorizontal: 5}]}>
                                        Add product or service
                                    </Paragraph>
                                </View>

                            </TouchableOpacity>


                            <Divider style={[styles.divider, styles.hide, {borderBottomColor: colors.divider}]}/>
                        </View>
                        }
                        {
                            Boolean(voucher?.settings?.assettype) && <View>
                                <Field name="taskdescription">
                                    {props => (
                                        <InputField
                                            label={'Description'}
                                            mode={'flat'}
                                            editmode={editmode}
                                            hideDivider={true}
                                            morestyle={styles.voucherDropdown}
                                            list={option_description}
                                            value={props.input.value}
                                            multiselect={true}
                                            selectedValue={props.input.value}
                                            selectedLabel={"Select Description"}
                                            displaytype={'pagelist'}
                                            inputtype={'dropdown'}
                                            listtype={'other'}
                                            key={uuidv4()}
                                            onAdd={(text: any, callBack: any) => {
                                                let item = assignOption(text, text);
                                                option_description.push(item);
                                                this.forceUpdate()
                                            }}
                                            onChange={(value: any) => {
                                                props.input.onChange(value);
                                            }}>
                                        </InputField>
                                    )}
                                </Field>
                            </View>
                        }
                    </View>


                </View>

            </View>
        )
    }

}


const mapStateToProps = (state: any) => ({
    voucheritems: state.appApiData.voucheritems,
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CartItems));


