import React, {Component} from "react";
import {View, Text, Image, Alert, Dimensions, Platform} from "react-native";
import {setDialog, setLoader} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Appbar, Paragraph, Surface, Title, withTheme} from "react-native-paper";
import AppBar from "../../components/AppBar";
import {CheckConnectivity, log, retrieveData} from "../../lib/functions";
import {setCompany, setPreferences, setSettings} from "../../lib/Store/actions/appApiData";
import {backButton, defaultvalues, nav} from "../../lib/setting";
import {firebase} from "@react-native-firebase/messaging";
import {store} from "../../App";
import {ScrollView} from "react-native-gesture-handler";
import Carousel, {Pagination} from "react-native-snap-carousel";


export const sliderWidth = Dimensions.get('window').width;
export const sliderHeight = Dimensions.get('window').height;


class Index extends Component<any> {

    _carousel:any;
    constructor(props:any) {
        super(props);
        this.state = {show:true,activeSlide:0,data:[
                {title:'1',text:'One place for all your work',text2:'Task, Docs, Goals and Chat customizable to work for everyone.'},
                {title:'2',text:'Save one day every week guaranteed',text2:'Users save one day every week by putting work in one place.'},
                {title:'3',text:'Personalized to the way you work',text2:'Customize app to work for you. No opinions, just options.'}]}
        this._carousel = React.createRef()
    }

    componentDidMount() {

    }

    _renderItem = ({item, index}:any) => {
        return (
            <View style={[styles.h_100,styles.center,{padding:30}]}>
                <Image
                    style={[{width:340,height:280,margin:'auto'}]}
                    source={require('../../assets/gettingstarted1.png')}
                />
                <Text style={[styles.title,{fontSize:35,fontWeight:'bold',padding:20}]}>{ item.text }</Text>
                <Text style={[styles.title,{fontSize:15,padding:10}]}>{ item.text2 }</Text>
            </View>
        );
    }

    render() {

        const {activeSlide,data}:any  = this.state;
        const {navigation,theme:{colors}}:any = this.props

        this.props.navigation.setOptions({
            headerTitle: `Dhru`,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Dhru'}</Title>,
            })
        }

        return (
            <Container  surface={true}>


                <View style={{height:750,marginTop:'auto'}}>
                    <ScrollView keyboardShouldPersistTaps='handled'>



                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={data}
                            activeSlideAlignment={'start'}
                            inactiveSlideScale={1}
                            renderItem={this._renderItem}
                            sliderWidth={sliderWidth}
                            sliderHeight={sliderHeight}
                            lockScrollTimeoutDuration={100}
                            itemWidth={sliderWidth}

                            lockScrollWhileSnapping={true}
                            style={[styles.h_100]}
                            onSnapToItem={(index) => this.setState({activeSlide:index}) }
                        />



                        <Pagination
                            dotsLength={3}
                            activeDotIndex={activeSlide}
                            containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0)'}}
                            dotStyle={{
                                width: 5,
                                height: 5,
                                borderRadius: 5,
                                marginHorizontal: 0,
                                marginVertical:0,
                                backgroundColor: 'rgba(0, 0, 0, 0.92)'
                            }}
                            inactiveDotStyle={{
                                // Define styles for inactive dots here
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />

                    </ScrollView>


                    <View style={[styles.p_6]}>
                        <Button      onPress={() => {
                            navigation.navigate('LoginStack', {
                                screen: 'LoginStack',
                            });
                        }}>Get Started</Button>
                    </View>
                </View>

            </Container>
        );
    }
}


const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({
    setCompany: (company:any) => dispatch(setCompany(company)),
    setPreferences: (preferences:any) => dispatch(setPreferences(preferences)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

