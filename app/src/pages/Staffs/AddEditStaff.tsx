import React, {Component} from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {Card, Paragraph, TextInput as TI, Title, withTheme,} from "react-native-paper";
import {Field, Form} from "react-final-form";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {assignOption, composeValidators, isEmail, minLength, mustBeNumber, required} from "../../lib/static";
import {setAlert} from "../../lib/Store/actions/components";
import {backButton, voucher} from "../../lib/setting";
import InputField from '../../components/InputField';
import ProIcon from "../../components/ProIcon";
import FormLoader from "../../components/ContentLoader/FormLoader";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"
import {log} from "../../lib/functions";


class AddEditStaff extends Component<any> {

    title: any = 'Add Staff';
    params: any;
    notificationObject: any;

    initdata: any = {
        "username": "",
        "canchangevouchernumber": true,
        "canviewprofit": true,
        "canviewnotes": true,
        "canchangeentrydate": true,
        "canapplydiscount": true,
        "discount": 100,
        "language": "English",
        "email": "",
        "firstname": "",
        "lastname": "",
        "loginpin": "12345",
        "role": "admin",
        "timezone": "Asia/Kolkata",
        "settings": {
            "defaultlocation": "06aa6e6d-a01b-43b5-849e-a1d84ba533ad",
            "language": "English",
            "web": true,
            "pos": true,
            "pocost": false,
            "reprint": false,
            "cancelkot": false,
            "cancelorder": false,
            "canchangevouchernumber": false,
            "canchangeentrydate": false,
            "canviewnotes": false,
            "canviewprofit": false,
            "canapplydiscount": false
        },
        "notification": {},
    }


    constructor(props: any) {
        super(props);


        const {route, notificationtemplategroup}: any = this.props;
        const {staff}: any = route.params;

        this.params = route.params;


        this.state = {isLoading: !Boolean(staff?.adminid),type:'staff'}


        Object.keys(notificationtemplategroup).map((key: any) => {
            const defaultValue = (key === '2ea41a10-e442-472b-9a11-9e25b7dce7a3')
            notificationtemplategroup[key] = {
                ...notificationtemplategroup[key],
                email: defaultValue,
                sms: defaultValue,
                whatsapp: defaultValue,
                telegram: defaultValue,
                web: defaultValue
            }
        })

        this.initdata.notification = {
            ...this.initdata.notification,
            ...notificationtemplategroup
        }

        if (Boolean(staff?.adminid)) {


            requestApi({
                method: methods.get,
                action: actions.staff,
                queryString: {staffid: staff?.adminid},
                loader: false,
                loadertype: 'form'
            }).then((result: any) => {
                if (result.status === SUCCESS) {
                    this.title = `${staff.firstname + ' ' + staff.lastname}`;
                    this.initdata = {...this.initdata, ...result.data[staff?.adminid]}
                }

                if (!Boolean(this.initdata.notification)) {
                    this.initdata.notification = {
                        ...this.initdata.notification,
                        ...notificationtemplategroup
                    }
                }

                this.setState({isLoading: true,type:this.initdata.email?'staff':'technician'})
            });


        }

    }


    handleSubmit = (values: any) => {

        log('values',values)

        values = {
            ...values,
            username: values.firstname + ' ' + values.lastname,
        }

        if(values.stafftype==='technician'){
            values.email = ''
        }

        requestApi({
            method: Boolean(this.initdata.adminid) ? methods.put : methods.post,
            action: actions.staff,
            body: values,
            showlog:true
        }).then((result) => {
            if (result.status === SUCCESS) {
                this.props.navigation.goBack()
                if (Boolean(this.params.getStaffs)) {
                    this.params.getStaffs()
                }
            }
        });
    }

    sentInvitation = () => {

        const {email, firstname, lastname}: any = this.initdata

        requestApi({
            method: methods.post,
            action: actions.invitation,
            body: {"email": email, "first_name": firstname, "last_name": lastname},
        }).then((result) => {
            if (result.status === SUCCESS) {

            }
        });
    }

    onChangeType = (type: any) => {
        this.initdata.stafftype = type
        this.setState({type:type},()=>{

        })
    }


    render() {

        const {navigation, role, theme: {colors}}: any = this.props;
        const {isLoading,type}: any = this.state;

        const option_role = role && Object.values(role).map((t: any) => assignOption(t, t));

        navigation.setOptions({
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{this.title}</Title>,
            })
        }

        if (!isLoading) {
            return <FormLoader/>
        }

        navigation.setOptions({
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerTitle: this.title,
        });

        return (
            <Container>

                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={{...this.initdata}}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>
                                <Card style={[styles.card]}>
                                    <Card.Content>

                                        {!Boolean(this.initdata.adminid) &&  <View style={[styles.mb_5,{marginLeft: -8}]}>

                                            <View style={[styles.grid]}>
                                                <View>
                                                    <TouchableOpacity onPress={()=>this.onChangeType('staff')}>
                                                        <View style={[styles.grid, styles.middle]}>
                                                            {<ProIcon   name={type==='staff'?'circle-check':'circle'}   />}
                                                            <Paragraph style={[styles.paragraph, styles.text_sm]}>
                                                                Staff
                                                            </Paragraph>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[{marginLeft:15}]}>
                                                    <TouchableOpacity onPress={()=>this.onChangeType('technician')}>
                                                        <View style={[styles.grid, styles.middle]}>
                                                            {<ProIcon   name={type==='technician'?'circle-check':'circle'} />}
                                                            <Paragraph style={[styles.paragraph, styles.text_sm]}>
                                                                Technician
                                                            </Paragraph>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        </View>}



                                        {Boolean(this.initdata.adminid) && <View style={[styles.grid, styles.middle]}>
                                            <View style={[styles.w_auto]}></View>
                                            {this.initdata.status === "Invite" &&
                                                <View style={[styles.cell, styles.middle, {paddingRight: 0}]}>
                                                    {<TouchableOpacity onPress={() => {
                                                        this.sentInvitation()
                                                    }}>
                                                        <View style={[styles.grid, styles.middle]}>
                                                            <ProIcon color={styles.green.color} name={'paper-plane'}/>
                                                            <Paragraph
                                                                style={[styles.paragraph, styles.text_sm, styles.green]}>
                                                                Resend Invitation
                                                            </Paragraph>
                                                        </View>
                                                    </TouchableOpacity>}
                                                </View>}
                                        </View>}


                                        {type === 'staff' &&  <Field name="email" validate={composeValidators(required, isEmail)}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value}
                                                    disabled={Boolean(this.initdata.adminid)}
                                                    autoCapitalize='none'
                                                    keyboardType='email-address'
                                                    label={'Email'}
                                                    inputtype={'textbox'}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>}

                                        <Field name="firstname" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value}
                                                    label={'First Name'}
                                                    inputtype={'textbox'}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>

                                        <Field name="lastname" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value}
                                                    label={'Last Name'}
                                                    inputtype={'textbox'}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>

                                        {type === 'staff' &&  <Field name="role" validate={required}>
                                            {props => (
                                                <InputField
                                                    label={'Access Role'}
                                                    mode={'flat'}
                                                    list={option_role}
                                                    value={props.input.value}
                                                    selectedValue={props.input.value}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    listtype={'other'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value)
                                                    }}>
                                                </InputField>
                                            )}
                                        </Field> }

                                        {type === 'staff' && <Field name="loginpin"
                                               validate={composeValidators(required, mustBeNumber, minLength(5))}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value}
                                                    label={'POS Login PIN'}
                                                    keyboardType='numeric'
                                                    inputtype={'textbox'}
                                                    maxLength={5}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>}


                                        <View>
                                            <Field name="discount">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        value={props.input.value + ''}
                                                        label={'Discount'}
                                                        keyboardType='numeric'
                                                        inputtype={'textbox'}
                                                        right={<TI.Affix text={'%'}/>}
                                                        onChange={props.input.onChange}
                                                    />
                                                )}
                                            </Field>
                                        </View>
                                    </Card.Content>
                                </Card>


                                <Card style={[styles.card]}>
                                    <Card.Content>
                                        <View><Paragraph style={[styles.paragraph, styles.caption]}>Login
                                            Access</Paragraph></View>

                                        <View style={{marginLeft: -20}}>
                                            <Field name="settings.web">
                                                {props => (
                                                    <><CheckBox
                                                        value={props.input.value}
                                                        label={`Web`}
                                                        onChange={props.input.onChange}/>
                                                    </>
                                                )}
                                            </Field>

                                            <Field name="settings.pos">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`POS`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>
                                        </View>
                                    </Card.Content>
                                </Card>


                                <Card style={[styles.card]}>
                                    <Card.Content>
                                        <View style={{marginLeft: -20}}>
                                            <Field name="settings.pocost">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Display Purchase Cost`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>

                                            <Field name="settings.reprint">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Allow Reprint`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>

                                            <Field name="settings.cancelkot">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Can Cancel KOT`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>

                                            <Field name="settings.cancelorder">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Can Cancel Order`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>

                                            <Field name="settings.canchangevouchernumber">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Can Set Custom Voucher Number`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>

                                            <Field name="settings.canchangeentrydate">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Can Change Entry Date`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>

                                            <Field name="settings.canviewnotes">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Can View Notes`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>

                                            <Field name="settings.canviewprofit">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Can View Profit on Sales Invoice`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>

                                            <Field name="settings.canapplydiscount">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Can Apply Discount`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>

                                        </View>

                                    </Card.Content>
                                </Card>

                                <Card style={[styles.card]}>
                                    <Card.Content>
                                        <View>
                                            <View><Paragraph
                                                style={[styles.paragraph, styles.caption, styles.mb_5]}>Notification</Paragraph></View>

                                            <ScrollView horizontal={true}>

                                                <View style={{marginLeft: 5}}>

                                                    <View>
                                                        <View style={[styles.row, styles.middle]}>
                                                            <View style={[styles.cell, {width: 60}]}>
                                                                <Text
                                                                    style={[styles.paragraph, styles.text_xs]}>Group</Text>
                                                            </View>
                                                            <View style={[styles.cell, styles.middle, {
                                                                width: 70,
                                                                marginRight: 10
                                                            }]}>
                                                                <Paragraph
                                                                    style={[styles.paragraph, styles.text_xs, styles.middle]}>Email</Paragraph>
                                                            </View>
                                                            <View style={[styles.cell, styles.middle, {
                                                                width: 70,
                                                                marginRight: 10
                                                            }]}>
                                                                <Paragraph
                                                                    style={[styles.paragraph, styles.text_xs]}>SMS</Paragraph>
                                                            </View>
                                                            <View style={[styles.cell, styles.middle, {
                                                                width: 75,
                                                                marginRight: 10
                                                            }]}>
                                                                <Paragraph
                                                                    style={[styles.paragraph, styles.text_xs]}>WhatsApp</Paragraph>
                                                            </View>
                                                            <View style={[styles.cell, styles.middle, {
                                                                width: 70,
                                                                marginRight: 10
                                                            }]}>
                                                                <Paragraph
                                                                    style={[styles.paragraph, styles.text_xs]}>Telegram</Paragraph>
                                                            </View>
                                                            <View style={[styles.cell, styles.middle, {
                                                                width: 70,
                                                                marginRight: 10
                                                            }]}>
                                                                <Paragraph
                                                                    style={[styles.paragraph, styles.text_xs]}>Web</Paragraph>
                                                            </View>
                                                        </View>
                                                    </View>


                                                    <View>
                                                        {
                                                            Object.keys(values.notification).map((key) => {
                                                                const {templategroupname}: any = values.notification[key];
                                                                return (
                                                                    <View style={[styles.row, styles.middle]}>
                                                                        <View style={[styles.cell, {width: 60}]}>
                                                                            <Paragraph
                                                                                style={[styles.paragraph, styles.text_xs]}>{templategroupname}</Paragraph>
                                                                        </View>
                                                                        <View style={[styles.cell]}>
                                                                            <View style={[{
                                                                                margin: 'auto',
                                                                                backgroundColor: '#f4f4f4'
                                                                            }]}>
                                                                                <Field
                                                                                    name={`notification[${key}].email`}>
                                                                                    {props => (
                                                                                        <CheckBox
                                                                                            value={props.input.value}
                                                                                            label={''}
                                                                                            onChange={props.input.onChange}/>
                                                                                    )}
                                                                                </Field>
                                                                            </View>
                                                                        </View>
                                                                        <View style={[styles.cell]}>
                                                                            <View style={[{
                                                                                margin: 'auto',
                                                                                backgroundColor: '#f4f4f4'
                                                                            }]}>
                                                                                <Field
                                                                                    name={`notification[${key}].sms`}>
                                                                                    {props => (
                                                                                        <>
                                                                                            <CheckBox
                                                                                                value={props.input.value}
                                                                                                label={''}
                                                                                                onChange={props.input.onChange}/>
                                                                                        </>
                                                                                    )}
                                                                                </Field>
                                                                            </View>
                                                                        </View>
                                                                        <View style={[styles.cell]}>
                                                                            <View style={[{
                                                                                margin: 'auto',
                                                                                backgroundColor: '#f4f4f4'
                                                                            }]}>
                                                                                <Field
                                                                                    name={`notification[${key}].whatsapp`}>
                                                                                    {props => (
                                                                                        <CheckBox
                                                                                            value={props.input.value}
                                                                                            label={''}
                                                                                            onChange={props.input.onChange}/>
                                                                                    )}
                                                                                </Field>
                                                                            </View>
                                                                        </View>
                                                                        <View style={[styles.cell]}>
                                                                            <View style={[{
                                                                                margin: 'auto',
                                                                                backgroundColor: '#f4f4f4'
                                                                            }]}>
                                                                                <Field
                                                                                    name={`notification[${key}].telegram`}>
                                                                                    {props => (
                                                                                        <CheckBox
                                                                                            value={props.input.value}
                                                                                            label={''}
                                                                                            onChange={props.input.onChange}/>
                                                                                    )}
                                                                                </Field>
                                                                            </View>
                                                                        </View>
                                                                        <View style={[styles.cell]}>
                                                                            <View style={[{
                                                                                margin: 'auto',
                                                                                backgroundColor: '#f4f4f4'
                                                                            }]}>
                                                                                <Field
                                                                                    name={`notification[${key}].web`}>
                                                                                    {props => (
                                                                                        <CheckBox
                                                                                            value={props.input.value}
                                                                                            label={''}
                                                                                            onChange={props.input.onChange}/>
                                                                                    )}
                                                                                </Field>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>

                                                </View>

                                            </ScrollView>
                                        </View>

                                    </Card.Content>

                                </Card>
                            </KeyboardScroll>
                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                        handleSubmit(values)
                                    }}>   {Boolean(this.initdata.adminid) ? 'Update' : 'Add'} </Button>
                                </View>
                            </KAccessoryView>

                        </View>
                    )}>
                </Form>


            </Container>

        )
    }

}


const mapStateToProps = (state: any) => ({
    role: state.appApiData.settings.role,
    notificationtemplategroup: state.appApiData.settings.notificationtemplategroup,
})
const mapDispatchToProps = (dispatch: any) => ({
    setAlert: (alert: any) => dispatch(setAlert(alert))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddEditStaff));


