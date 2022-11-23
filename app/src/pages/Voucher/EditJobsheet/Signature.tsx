import * as React from 'react';
import {Surface} from 'react-native-paper';
import {Platform, View} from "react-native";
import {styles} from "../../../theme";
import {setDialog, setLoader, setModal} from "../../../lib/Store/actions/components";
import {connect} from "react-redux";
import {AppBar, Button} from "../../../components";
import Signature from "react-native-signature-canvas";
import {dataURLToFile, log, uploadFile} from "../../../lib/functions";
import {voucher} from "../../../lib/setting";
import moment from "moment";


const imgWidth = '100%';
const imgHeight = 650;
const style = `.m-signature-pad {box-shadow: none; border: none; }
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}; height: ${imgHeight}px;}`;

class Index extends React.Component<any> {

    ref:any;
    constructor(props:any) {
        super(props);
        this.ref = React.createRef()
    }

    componentDidMount() {

    }

    handleOK = async (signature:any) => {

        const {values,setVoucherData,handleSubmit,setModal,setLoader}:any = this.props;

        let fileName = "ID" + voucher.data.voucherdisplayid + "_" + moment().format("DD_MM_YYYY_HH_mm_ss");

        const file = await dataURLToFile(signature, fileName);

        setLoader({show: true,type:'activity'})

        uploadFile(file, (response: any) => {
            if (response?.download_url)
            {
                voucher.data.signature = response?.download_url;
                setModal({visible:false})
                setVoucherData(values);
                setLoader({show: false})
                handleSubmit();
            }
        }).then(r => {

        })
    };

     handleClear = () => {
        this.ref.current.clearSignature();
    };

     handleConfirm = () => {
        this.ref.current.readSignature();
    };

    render(){
        return (
            <Surface>

                <AppBar back={true} title={`Signature`} isModal={true}></AppBar>

                <View  style={[styles.px_6,styles.h_90]}>
                    <Signature
                        ref={this.ref}
                        onOK={this.handleOK}
                        imageType={'image/png'}

                        autoClear={false}
                        bgWidth={imgWidth}
                        bgHeight={imgHeight}
                        webStyle={style}

                    />
                </View>

                {<View style={[styles.submitbutton,styles.p_6,{marginTop:'auto',marginBottom: 10}]}>
                    <View style={[styles.grid,styles.justifyContent]}>
                        <Button  style={{width:'48%'}}  secondbutton={true}  onPress={this.handleClear}> {`Clear`}</Button>
                        <Button style={{width:'48%'}}   onPress={this.handleConfirm}> {`Confirm`} </Button>
                    </View>
                </View>}
            </Surface>
        );
    }
}






const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
    setModal:(page:any) => dispatch(setModal(page)),
    setLoader:(loader:any) => dispatch(setLoader(loader)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);



