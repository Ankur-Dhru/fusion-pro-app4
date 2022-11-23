import React, {Component, useEffect} from 'react';
import {FlatList, StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {connect} from "react-redux";
import {filterArray, log} from "../../lib/functions";
import {List, Paragraph, Searchbar, Surface, Title, Divider, withTheme} from "react-native-paper";

import {AppBar, Container, Menu} from "../index";
import {setModal} from "../../lib/Store/actions/components";
import {styles} from "../../theme";



class DropdownList extends Component<any> {


    filterlist:any = [];

    constructor(props:any) {
        super(props);
        this.filterlist = this.props.list
    }

    renderList = ({item}:any) => {
        const {onSelect,setModal}:any = this.props;
        const {colors}:any = this.props.theme;
        return (
            <>
                <View style={[{paddingLeft:8}]}>
                    <TouchableOpacity onPress={()=> {onSelect(item); setModal({visible:false}) }}>
                        <List.Item title={item.label}/>
                    </TouchableOpacity>
                </View>
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </>
        );
    };

    handleSearch = (search:any) => {
        const {list}:any = this.props;
        this.filterlist = filterArray(list,['label'],search);
        this.forceUpdate()
    }

    render() {

        const {label}:any = this.props;
        return (

            <Container  surface={true}>

                <AppBar back={true} title={''} isModal={true}>
                    <Search handleSearch={this.handleSearch} label={label}/>
                    <View style={{width:10}}></View>
                </AppBar>

                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    scrollIndicatorInsets={{ right: 1 }}
                    data={this.filterlist}
                    accessible={true}
                    renderItem={this.renderList}
                    keyExtractor={item => item.value}
                />
            </Container>

        );
    }
}


const Search = (props:any) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query:any) => { setSearchQuery(query) };

    useEffect(() => {
        if(searchQuery.length>2) {
            const delayDebounceFn = setTimeout(() => {
                props.handleSearch(searchQuery);
            }, 1000)
            return () => clearTimeout(delayDebounceFn)
        }
    }, [searchQuery])

    return (
        <Searchbar
            placeholder={`Search ${props.label}`}
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={[styles.bg_global,styles.w_auto,{elevation:0}]}
        />
    );
};


const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({
    setModal: (dialog:any) => dispatch(setModal(dialog)),

});
export default connect(mapStateToProps,mapDispatchToProps)(withTheme(DropdownList));




/*<FlatList list={[
    {key: 'Devin'},
{key: 'Dan'},
{key: 'Dominic'},
{key: 'Jackson'},
{key: 'James'},
{key: 'Joel'},
{key: 'John'},
{key: 'Jillian'},
{key: 'Jimmy'},
{key: 'Julie'},
]}/>*/
