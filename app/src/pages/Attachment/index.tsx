import React, {Component} from 'react';
import {Alert, Platform, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {connect} from "react-redux";
import {Card, Paragraph, withTheme} from "react-native-paper";

import {setDialog, setLoader} from "../../lib/Store/actions/components";

import DocumentPicker from 'react-native-document-picker'
import {errorAlert, isEmpty, log, uploadFile} from "../../lib/functions";
import {backupVoucher, voucher} from "../../lib/setting";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import {v4 as uuidv4} from 'uuid';
import {ProIcon} from "../../components";
import ActionSheet from '../../components/ActionSheet';
import ImagePicker from "react-native-image-crop-picker";
import ThumbView from "./ThumbView";

import Confirm from "react-native-actionsheet";


class Attachment extends Component<any> {

    camera: any;
    ActionSheet2: any;

    attachmentindex: any

    constructor(props: any) {
        super(props);

        this.state = {
            multipleFile: [],
        };
        this.ActionSheet2 = React.createRef()
    }

    removeAttachment = (index: any) => {
        const {setDialog}: any = this.props;
        setDialog({visible: false})
        voucher.data.files.splice(index, 1)
        this.forceUpdate()
    }

    componentDidMount() {

    }


    MultipleFilePicker = () => {

        if (Platform.OS === "ios") {
            requestMultiple([
                PERMISSIONS.IOS.PHOTO_LIBRARY,
            ]).then(statuses => {
                if (statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] === 'granted') {
                    this.pickImage()
                }
            });
        } else {
            this.pickImage()
        }
    }

    pickImage = () => {
        if (!Boolean(voucher.data.files)) {
            voucher.data.files = []
        }
        try {
            DocumentPicker.pickMultiple({
                /*type: [DocumentPicker.types.images],*/
            }).then((results: any) => {
                let that = this;


                if (!Boolean(voucher.data.files) || this.props?.singleImage) {
                    voucher.data.files = []
                }

                results.map((file: any) => {
                    let uuid = uuidv4()
                    voucher.data.files.push({id: uuid, status: 'uploading', file_name: file.name});
                    uploadFile(file, function (response: any) {
                        if (!Boolean(that.props.doNotReplaceProtocol)) {
                            response.download_url = response.download_url.replace('http://', '').replace('https://', '');
                        }

                        voucher.data.files.map((file: any) => {
                            if (file.id === uuid) {
                                file.status = 'uploaded';
                                file.download_url = response.download_url;
                            }
                        })
                        that.forceUpdate();
                    }, false, that.props.doNotReplaceProtocol);
                })
                that.forceUpdate();
            })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {

            } else {
                throw err
            }
        }
    }

    handleBack = () => {
        const {navigation}: any = this.props
        navigation.goBack();
    }

    handleCapture = async (data: any) => {


        if(data.size <= 5242880) {
            const {onChange}: any = this.props

            let that = this;

            let datetime = uuidv4();

            if (!Boolean(voucher.data.files) || this.props?.singleImage) {
                voucher.data.files = []
            }


            let uuid = uuidv4()

            voucher.data.files.push({
                id: uuid,
                status: 'uploading',
                uri: data.sourceURL,
                type: data.mime,
                file_name: datetime + '.jpg'
            });

            if (!isEmpty(backupVoucher.voucher.data)) {
                backupVoucher.voucher.data.files = voucher.data.files
            }


            Boolean(onChange) && onChange({value: voucher.data.files})
            that.forceUpdate();

            await uploadFile({uri: data.path, name: datetime, type: data.mime}, function (response: any) {
                if (!Boolean(that.props.doNotReplaceProtocol)) {
                    response.download_url = response.download_url.replace('http://', '').replace('https://', '');
                }
                voucher.data.files.map((file: any) => {
                    if (file.id === uuid) {
                        file.status = 'uploaded';
                        file.download_url = response.download_url;
                    }
                })
                if (!isEmpty(backupVoucher.voucher.data)) {
                    backupVoucher.voucher.data.files = voucher.data.files
                }
            }).then();

            Boolean(onChange) && onChange({value: voucher.data.files})
            that.forceUpdate();
        }
        else{
            errorAlert('Can upload maximum upto 5MB file size')
        }

    }

    launchCamera = async () => {
        const {navigation}: any = this.props;

        if (Platform.OS === "ios") {
            requestMultiple([
                PERMISSIONS.IOS.CAMERA,
            ]).then(statuses => {
                if (statuses[PERMISSIONS.IOS.CAMERA] === 'granted') {

                    navigation.push('CaptureImage', {
                        screen: 'CaptureImage',
                        handleCapture: this.handleCapture,
                        handleBack: this.handleBack
                    })
                }
            });
        } else {
            navigation.push('CaptureImage', {
                screen: 'CaptureImage',
                handleCapture: this.handleCapture,
                handleBack: this.handleBack
            })
        }
    }


    pickSingleWithCamera(cropping: any, mediaType: any = 'photo') {
        ImagePicker.openCamera({
            cropping: cropping,
            freeStyleCropEnabled: true,
            compressImageQuality:0.3,
            includeExif: true,
            mediaType,
        })
            .then((image) => {
                this.handleCapture(image)
            })
            .catch((e) => alert(e));
    }


    pickSingle(cropit: any, circular = false, mediaType: any) {
        ImagePicker.openPicker({
            cropping: cropit,
            cropperCircleOverlay: circular,
            sortOrder: 'none',
            freeStyleCropEnabled: true,
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 0.3,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
            cropperStatusBarColor: 'white',
            cropperToolbarColor: 'white',
            cropperActiveWidgetColor: 'white',
            cropperToolbarWidgetColor: '#3498DB',
        })
            .then((image) => {
                this.handleCapture(image)
            })
            .catch((e) => {
                console.log(e);
                Alert.alert(e.message ? e.message : e);
            });
    }

    pickMultiple() {
        ImagePicker.openPicker({
            multiple: true,
            maxFiles:10,
            waitAnimationEnd: false,
            freeStyleCropEnabled: true,
            compressImageQuality:0.3,
            sortOrder: 'desc',
            includeExif: true,
            forceJpg: true,
        })
            .then((images) => {
                images.map((image) => {
                    this.handleCapture(image)
                })
            })
            .catch((e) => alert(e));
    }


    render() {

        const {navigation, setDialog, editmode, label, preview, icon, hideLabel}: any = this.props;
        const colors = this.props.theme;

        return (
            <View>

                {editmode && <ActionSheet

                    options={['Take a new photo', 'Photo Library', 'Document', 'Cancel']}
                    cancelButtonIndex={3}
                    destructiveButtonIndex={5}
                    onPress={(index: any) => {
                        if (index === 0) {
                            //this.launchCamera();
                            this.pickSingleWithCamera(true)
                        }
                        if (index === 1) {
                            this.pickMultiple()
                            //this.MultipleFilePicker();
                        }
                        if (index === 2) {
                            this.MultipleFilePicker();
                        }
                    }}
                >
                    {icon ? <ProIcon name={'paperclip'} size={16}/> : !Boolean(hideLabel) &&
                        <Card style={[styles.card, {marginBottom: 0}, Boolean(voucher?.data?.files?.length) && {borderBottomLeftRadius:0,borderBottomRightRadius:0}]}>
                            <Card.Content style={{paddingBottom: 0}}>
                                <View style={[styles.grid, styles.middle, styles.mb_5]}>
                                    <ProIcon color={styles.green.color} action_type={'text'} name={'circle-plus'}/>
                                    <Paragraph
                                        style={[styles.paragraph, styles.text_sm, styles.green, {marginHorizontal: 5}]}>
                                        {label}
                                    </Paragraph>
                                </View>
                            </Card.Content>
                        </Card>
                    }

                </ActionSheet>}


                {preview && Boolean(voucher?.data?.files?.length) &&

                    <Card style={[styles.card,{borderTopLeftRadius:0,borderTopRightRadius:0},Boolean(hideLabel) && {marginTop:0,marginBottom:5}]}>
                        <Card.Content style={[Boolean(hideLabel) && {paddingHorizontal: 0,paddingVertical:0}]}>

                            <View style={[styles.grid]}>

                                {<Confirm
                                    ref={o2 => this.ActionSheet2 = o2}
                                    options={['Delete', 'Cancel']}
                                    cancelButtonIndex={1}
                                    destructiveButtonIndex={0}
                                    onPress={(index: any) => {
                                        if (index === 0) {
                                            this.removeAttachment(this.attachmentindex)
                                        }
                                    }}
                                />}


                                {voucher?.data?.files?.map((item: any, key: any) => {


                                    let extentation = item.file_name ? item.file_name.split('.').pop() : '';

                                    return (
                                        <View key={key} style={[styles.mr_2,styles.mb_2]}>

                                            {item.status === 'uploading' ? <View>
                                                <ThumbView source={item} extentation={extentation}/>
                                            </View> : <>

                                                <TouchableOpacity onPress={() => {
                                                    navigation.push('FullView', {
                                                        screen: 'FullView',
                                                        item: item
                                                    })
                                                }} onLongPress={() => {
                                                    this.attachmentindex = key;
                                                    editmode && this.ActionSheet2.show()
                                                }}>

                                                    <ThumbView source={{...item, uri: `https://${item.download_url.replace('http://', '').replace('https://', '')}`}}
                                                               extentation={extentation}/>

                                                </TouchableOpacity>

                                                {/*{editmode &&  <TouchableOpacity style={[styles.absolute,{right:4,top:-8}]}  onPress={() => setDialog({title: 'Confirmation',visible:true,component: ()=><Paragraph style={[styles.paragraph,]}>Are you sure want to delete?</Paragraph>,actionButton:()=> <Button mode={'contained'} onPress={()=> {this.removeAttachment(key)}}>OK</Button> }) }>
                                            <Paragraph style={[styles.paragraph,{textAlign:'center'}]}>
                                                <ProIcon  name={'times-square'} type={'solid'} color={'white'} size={14}  />
                                            </Paragraph>
                                        </TouchableOpacity> }*/}

                                            </>}

                                        </View>
                                    )
                                })

                                }

                            </View>

                            {<Paragraph style={[styles.paragraph,styles.muted,styles.text_xxs]}>Long press to delete</Paragraph>}

                        </Card.Content>
                    </Card>
                }

            </View>
        )
    }


}

const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
})

const mapDispatchToProps = (dispatch: any) => ({
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    setLoader: (loader: any) => dispatch(setLoader(loader)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Attachment));


