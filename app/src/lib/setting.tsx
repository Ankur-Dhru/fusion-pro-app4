// Check Development Mode Or Production Mode

import React from "react";
import {ProIcon} from "../components";

const isDevelopment = process.env.NODE_ENV === "development";
const apiUrls = "https://fusionpro-api.dhru.net/admin/v1/";
const apiUrl = (company:string) =>  `https://${company}.api.dhru.io/admin/v1/`;
const mainUrl = "https://api.dhru.com"
const loginUrl: any = `${mainUrl}/client/api/v1/`;
//const apiUrl = "https://fusionpro-api.dhru.net/admin/v1/";
//const captchakey = "6LfA_N0ZAAAAAFxncGIVplNOKfPkV_HLS-9vl8Yr"; google captcha key
const captchakey = "6LebDscZAAAAAEfuz_E-rB6r12xLHekW_XlR-Y5V";
export const auth: any = {
    token: '',
    license_token: '',
    device_token: '',
    reuse_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik1RPT0ifQ.eyJqaXQiOiI2NTc5NGY0ZC1jYzdhLTRkMjAtYjg3Yi05NTlhNjA0YTY1NWUiLCJmaWciOiI3YTAxYzc0ZDAyZTZkMDFmY2I3OTgzZGI5NDA1NjM3YmZmNDU1MmZlNDdkMTc0NjU3ZWE1YjQ5NjUzODFiMWEwIiwic3ViIjoiNjA0MCIsImlzcyI6ImFwaS5kaHJ1LmNvbSIsImF1ZCI6IndlYiIsImlhdCI6MTY0MzA4NDU0MCwibmJmIjoxNjQzMDg0NTQwLCJleHAiOjE2NDMwODQ2MjYsImVucCI6Ijk0OGZlNjAzZjYxZGMwMzZiNWM1OTZkYzA5ZmUzY2UzZjNkMzBkYzkwZjAyNGM4NWYzYzgyZGIyY2NhYjY3OWQiLCJkYXRhIjp7ImNsaWVudGlkIjoiMTZhOGFiOWYtNWY5YS00ZWExLTlkNDYtYzE4Nzg3ZmM2NjU0IiwiZmlyc3RuYW1lIjoiRGV2IiwibGFzdG5hbWUiOiJUZWFtIiwiY29tcGFueW5hbWUiOiJESFJVX0lPIiwiZW1haWwiOiJkaHJ1ZXJwQGRocnVzb2Z0LmNvbSIsImNvdW50cnkiOiJJTiIsImxhbmd1YWdlIjoiIiwid2hhdHNhcHBfbnVtYmVyIjpudWxsLCJtb2JpbGVfbnVtYmVyIjpudWxsLCJncm91cCI6IlVTRVIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibW9iaWxlX3ZlcmlmaWVkIjpmYWxzZSwid2hhdHNhcHBfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJjdXJyZW5jeSI6IlVTRCIsIndvcmtzcGFjZXMiOlt7ImlkIjoiZDJjOWZhMWMtNjI5Yi00YTg0LWIzNGQtNzBkYTIxYTc1NGM0IiwibmFtZSI6ImFrYXNoIiwic3RhdHVzIjoiQWN0aXZlIiwib3duZXIiOnRydWV9LHsiaWQiOiIzNGRmOTljNS05MjNlLTQwODEtOWI5YS1kMDEzMTgwMTBjMWIiLCJuYW1lIjoidGVzdDEwMSIsInN0YXR1cyI6IkFjdGl2ZSIsIm93bmVyIjp0cnVlfSx7ImlkIjoiOWU5OTM3OWUtZjI1MC00N2E1LWE0NzItYWUzZmFlNGEwMWU0IiwibmFtZSI6ImRocnUiLCJzdGF0dXMiOiJBY3RpdmUiLCJvd25lciI6dHJ1ZX0seyJpZCI6ImQ2ZDdjZGMzLTU4NzAtNDA5Ny05MjZhLTQwOGIwODE1MDM5MCIsIm5hbWUiOiJkZW1vIiwic3RhdHVzIjoiQWN0aXZlIiwib3duZXIiOnRydWV9LHsiaWQiOiI4MWNiMTM4NC0yZTY5LTQxZTctODY3OS01ZmM2M2FjMjgyMjkiLCJuYW1lIjoiZGV2Iiwic3RhdHVzIjoiQWN0aXZlIiwib3duZXIiOnRydWV9LHsiaWQiOiI2ZTBkYTU5OS02ODZkLTQ5NzctOGQzMS0yMjFjNDVlMDNmMzQiLCJuYW1lIjoicmVzZGVtbyIsInN0YXR1cyI6IkFjdGl2ZSIsIm93bmVyIjp0cnVlfSx7ImlkIjoiNTg1OWE5OTMtYzgyMy00ODk3LWI3NzUtYWY2NzE3NDFhN2NiIiwibmFtZSI6InZpdmVrIiwic3RhdHVzIjoiQWN0aXZlIiwib3duZXIiOnRydWV9LHsiaWQiOiJlYmZiYTY4NS0wZWUzLTRhMDAtYTBkYy1lZmViMmUzMzNlOGEiLCJuYW1lIjoic2VydmljZWRlbW8iLCJzdGF0dXMiOiJBY3RpdmUiLCJvd25lciI6dHJ1ZX1dfX0.EiESN9NACTDmtir8QCwFOWeHh8wDVRknvs6xQucKM5s0HZmmth82fgAEgywdsOs1UIpOM90riStRAMreEgN8VNrlHB8kXR2UgQvUJQa51qYkR1LuOlcK70oKOhSz3MSffS1WORsd1QFf10jReu4-JMD5qvtWs_6d-sjiL2C07UFsbryxRYfqgx_JiYG5TqJBizr4m5ZQvPfsEnNiFwX8vM2PiTgNaD5YGOJqyqVqNzmmFItNjbkG9ARo8vohaZfZ9itoxR0oeADg19vLdZIVuCtCR4p_kCAvpxP-bwBUK6tUdmTghdykNyjy89ezr-Y1FhgVacmmQ-WvkIE_Xawv26bFPV8_KD_l3kUT1YSn8vw_QxzuYOBs559ftJtmKQJqZ36siRoMzcIntDpv1_18b3g2mYztbM1-pkc2XWQomPw-4Q89KBAz1wVxGnx6qR60zqJWAKm3m2ObTTSKKpMvj4iVbmEHHH9aE-ap7UP_Bp2dSdZ1lTBO2bblefseHtZbJD265338ZzwHDmr1iiGJuAzWgclylNY0F2GwSkqQ-32KIxsTTisI_gNvW91iXJAUSK7av-DQmnEZuBs4gx5PUbeH58SVOyIipMsvgRSQH47qrs2oJSp1azs7zpriDxSdD1cKQq1okfyEMs1TKmpK1B5FsMw7Mb0gnQJsnKLrEuk"
};
export const voucher: any = {settings: {},other:{}, data: {files: []}, type: {}};
export let update: any = {required: false};
export let spotlight = {
    one: true,
    two: true
}
export const backupVoucher: any = {
    voucher: {}
};
export const nav: any = {navigation: {updateEmail:""}}
export const current: any = {user: '', company: '', locationid: "", countrycode: "", clientid: ''}
export const defaultvalues: any = {
    tickettype: '21d93846-7963-49ea-af75-c5d06a24ce33',
    tasktype: 'general',
    ticketdisplayid: '',
    socketconnection: false,
    internetconnection: true,
    theme: '',
    isReceiveURL: false,
}
//const apiUrl = "http://localhost:3000/api/v1/";
export {isDevelopment, apiUrl, loginUrl, captchakey, mainUrl}

export const backButton: any = <ProIcon align={'left'} name={'chevron-left'}/>;
export const chevronRight: any = <ProIcon name={'chevron-right'} align={'right'} color={'#bbb'} size={16}/>;


export const screenOptionStyle: any = {
    headerShown: true,
    animation: false,

    headerTitle: '',
    headerTitleAlign: 'center',
    headerLargeTitle: false,
    fullScreenSwipeEnabled: false,

    disableBackButtonMenu: false,
    backButtonInCustomView: false,
    headerBackTitleVisible: false,
    headerHideBackButton: false,
    headerBackTitle: 'Back',
    headerTintColor: 'black',

    stackAnimation: 'slide_from_right',
    stackPresentation: 'push',

    screenOrientation: 'portrait',
    autoCapitalize: 'sentences',

    headerTopInsetEnabled: false,

    headerHideShadow: true,

    headerLargeTitleHideShadow: true,
    headerLargeTitleStyle: {},


    headerStyle: {
        shadowOpacity: 0,
        elevation: 0,
    },

    backTitleStyle: {},


};
