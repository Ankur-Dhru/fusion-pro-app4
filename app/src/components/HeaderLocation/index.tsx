import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import {Text, Title, withTheme} from "react-native-paper";
import {setDialog} from "../../lib/Store/actions/components";
import {setCompany, updateVoucherItems} from "../../lib/Store/actions/appApiData";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {ProIcon} from "../index";
import InputField from "../InputField";
import Avatar from "../Avatar";
import {clone, getCurrentCompanyDetails, log, storeData} from "../../lib/functions";
import {assignOption} from "../../lib/static";
import {current} from "../../lib/setting";

class Index extends Component<any, any> {

    constructor(props: any) {
        super(props);
        const {companydetails} = this.props;
        const {companies, currentuser} = companydetails;
        let locationsObject = companies[currentuser]?.locations;
        let locationList:any = Boolean(locationsObject) && Object.values(locationsObject)
            .map(({locationid, locationname}: any) => assignOption(locationname, locationid));

        let multilocation = Boolean(locationList?.length > 1)

        this.state = {
            locationsObject,
            locationList,
            multilocation
        }
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    }

    render() {
        const {theme: {colors}, setCompany, companydetails, moreStyle} = this.props;
        const {locationList, locationsObject, multilocation} = this.state;
        const {currentuser, companies} = companydetails;
        let locationid = companies[currentuser]?.locationid;
        let locationname = Boolean(locationsObject) && locationsObject[locationid]?.locationname;


        return <View>
            <InputField
                moreStyle={moreStyle}
                label={'Locations'}
                divider={true}
                removeSpace={true}
                editmode={multilocation}
                displaytype={'bottomlist'}
                inputtype={'dropdown'}
                render={() => <View style={[styles.grid, styles.middle, styles.noWrap]}>
                    <Title>{locationname} </Title>
                    {multilocation && <ProIcon name={'chevron-down'} action_type={'text'} color={'#bbb'} size={14}/>}
                </View>}
                list={locationList}
                search={false}
                selectedValue={locationid}
                listtype={'other'}
                onChange={(value: any) => {
                    companydetails.companies[currentuser].locationid = value
                    storeData('fusion-pro-app', companydetails).then((r: any) => {
                        current.locationid = value;
                        setCompany({companydetails})
                    });
                }}
            />
        </View>;
    }
}

const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch: any) => ({
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
    setCompany: (company: any) => dispatch(setCompany(company)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

