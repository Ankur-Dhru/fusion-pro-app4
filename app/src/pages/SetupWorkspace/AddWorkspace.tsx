import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Keyboard, Platform, View} from 'react-native';
import {styles} from "../../theme";
import {setCompany} from "../../lib/Store/actions/appApiData";

import {Card, Paragraph, Title, withTheme} from "react-native-paper";
import requestApi, {methods, SUCCESS} from "../../lib/ServerRequest";
import {Button, Container, InputBox} from "../../components";
import {Field, Form} from 'react-final-form';

import {setDialog} from "../../lib/Store/actions/components";
import {auth, backButton, current, loginUrl, nav} from "../../lib/setting";
import {CheckConnectivity, getInit, log, queryStringToJSON, retrieveData, storeData} from "../../lib/functions";
import KeyboardScroll from "../../components/KeyboardScroll";
import {composeValidators, required, startWithString} from "../../lib/static";
import {CommonActions} from "@react-navigation/native";


class CompanyName extends Component<any> {


    constructor(props: any) {
        super(props);
    }


    handleSubmit = (values: any) => {

        Keyboard.dismiss();
        const {navigation,setCompany}: any = this.props;

        values.companyname = values?.companyname?.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");


        requestApi({
            method: methods.post,
            action: 'order',
            other: {url: loginUrl},
            body: {itemid: '3d44bcb5-afbc-4153-af6a-aa3457ebe119', domain: values?.companyname},
            showlog: false
        }).then((result) => {
            if (result.status === SUCCESS) {


                let workspacelogin = result?.data[0]?.workspace_login;
                const params = queryStringToJSON(workspacelogin);

                auth.token = params['t'];

                retrieveData('fusion-pro-app').then((companydetails: any) => {

                    const {adminid}: any = companydetails;

                    current.user = values.companyname + '-' + current.clientid;
                    current.company = values.companyname;

                    companydetails.token = auth.token;

                    companydetails.adminid = adminid;

                    companydetails.current = current.company;
                    companydetails.currentuser = current.user;



                    companydetails.companies[current.user] = {
                        firstname: companydetails.firstname,
                        lastname: companydetails.lastname,
                        email: companydetails.email,
                        password: companydetails.password,
                        adminid: companydetails.adminid,
                        username:companydetails.firstname + ' ' + companydetails.lastname,
                        locationid: '',
                        company:current.company,
                        defaultcurrency: '',
                        locations: '',
                        'services': [],
                        'clients': [],
                        vendors: [],
                    }



                    storeData('fusion-pro-app', companydetails).then(async (r: any) => {
                        setCompany({companydetails})

                        getInit(companydetails, navigation, '', () => {
                            navigation.replace('OrganizationProfile', {
                                screen: 'OrganizationProfile',
                            });
                        }, "activity")
                    });



                })

            }
        });
    }

    componentDidMount() {

    }


    render() {

        const {theme: {colors}}: any = this.props

        this.props.navigation.setOptions({
            headerTitle: `Add Workspace`,
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => this.props.navigation.goBack()}>{backButton}</Title>
        });

        if (Platform.OS === "android") {
            this.props.navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Add Workspace'}</Title>,
            })
        }


        return (
            <Container surface={true}>

                <Form
                    onSubmit={this.handleSubmit}

                    render={({handleSubmit, submitting, values, ...more}: any) => (

                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>

                                <Card style={[styles.card]}>

                                    <Card.Content>

                                        <Field name="companyname"
                                               validate={composeValidators(required, startWithString)}>
                                            {props => (
                                                <InputBox
                                                    {...props}
                                                    value={props.input.value}
                                                    label={'Workspace'}
                                                    autoFocus={true}
                                                    autoCapitalize='none'
                                                    /*onSubmitEditing={(e:any) => {
                                                        this.handleSubmit(values)
                                                    }}
                                                    returnKeyType={'go'}
                                                    */

                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>

                                        <Paragraph style={[styles.paragraph, styles.red, styles.text_xs, styles.py_2]}>Workspace
                                            name must start with an alphabet</Paragraph>

                                    </Card.Content>

                                </Card>

                            </KeyboardScroll>

                            <View style={[styles.submitbutton]}>
                                <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                    handleSubmit(values)
                                }}>Next</Button>
                            </View>

                        </View>

                    )}
                >

                </Form>

            </Container>

        )
    }
}


const mapStateToProps = (state: any) => ({
    companydetails: state.appApiData.companydetails,
    connection: state.appApiData.connection,
})
const mapDispatchToProps = (dispatch: any) => ({
    setCompany: (company: any) => dispatch(setCompany(company)),
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CompanyName));

