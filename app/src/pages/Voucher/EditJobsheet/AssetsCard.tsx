import React, {memo, useEffect, useState} from "react";
import {styles} from "../../../theme";
import {Card, Paragraph} from "react-native-paper";
import {View} from "react-native";
import {chevronRight, voucher} from "../../../lib/setting";
import {connect} from "react-redux";
import {getType, isEmpty, log} from "../../../lib/functions";

const AssetsCard = memo(({values, assettypeList, navigation, assetRole, editmode}: any) => {

    const [selectedAssets, setSelectedAssets] = useState();
    const [assetsName, setAssetsName] = useState();
    const [baseFieldName, setBaseFieldName] = useState();
    const [editData, setEditData] = useState<any>();

    useEffect(() => {
        if (values?.clientasset) {
            const findId: any = Object.keys(voucher?.data?.clientasset).find((assetid: any) => assetid === voucher?.data?.assetid);
            const assetData: any = voucher?.data?.clientasset[findId];

            if (assetData?.assettype) {
                setData(assetData?.assettype);
            }


            let data: any = {};
            if (!isEmpty(assetData?.data)) {
                Object.keys(assetData?.data).forEach((key: any) => {
                    if (key !== "assetname" &&
                        key !== "basefield" &&
                        key !== "model" &&
                        key !== "brand") {
                        data[key] = assetData.data[key];
                    }
                })
            }


            let baseFieldData = assetData?.basefield;




            if (Boolean(assetData?.basefield)) {
                try {
                    baseFieldData = JSON.parse(assetData?.basefield)
                }  catch (e) {

                }
            }

            setEditData({
                assetid: values?.assetid,
                assettype: assetData?.assettype,
                assetname: assetData?.assetname,
                brand: assetData?.brand,
                model: assetData?.model,
                basefield: baseFieldData,
                data
            });
            setSelectedAssets(assetData)
        }
    }, [values?.clientasset])


    const setData = (type: any) => {
        const assetItem = assettypeList[type];

        if (assetItem) {
            setAssetsName(assetItem?.assettypename);
            const findBaseKey = Object.keys(assetItem?.customfield).find((key: any) => Boolean(assetItem?.customfield[key]?.base));
            if (findBaseKey) {
                const baseObject = assetItem.customfield[findBaseKey].name;
                setBaseFieldName(baseObject)
            }
        }
    }

    const setEditAssetData = ({assetdata, ...otherData}: any) => {

        setData(otherData.assettype);
        setEditData({
            ...editData,
            ...otherData,
            ...assetdata
        })
    }

    if (selectedAssets) {
        return <Card style={[styles.card]} onPress={() => {
            navigation.navigate("EditAssets", {
                editData: {...editData, accessories: values.accessories},
                values,
                editmode: editmode,
                setEditAssetData
            })
        }}>
            <Card.Content>
                <View style={[styles.grid, styles.justifyContent, styles.middle]}>
                    <View>
                        <Paragraph
                            style={[styles.paragraph, styles.caption]}>{editData?.assetname} ({assetsName})</Paragraph>
                        {
                            (Boolean(baseFieldName) && Boolean(editData?.basefield)) &&
                            <Paragraph
                                style={[styles.paragraph]}>{baseFieldName} : {getType(editData?.basefield) === "object" ? editData?.basefield?.typevalue : editData?.basefield}</Paragraph>
                        }
                        <Paragraph style={[styles.paragraph]}>{editData?.brand} {editData?.model}</Paragraph>
                    </View>
                    {chevronRight}
                </View>
            </Card.Content>
        </Card>
    }

    return <View></View>

})

const mapStateToProps = (state: any) => ({
    assettypeList: state?.appApiData.settings.assettype
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(AssetsCard);

