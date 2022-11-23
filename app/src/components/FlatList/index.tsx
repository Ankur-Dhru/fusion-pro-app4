import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, ScrollView} from 'react-native';
import {connect} from "react-redux";


class Index extends Component<any, any> {

    onSelect = () => {

    };

    render() {
        const {list, onClick, ...other}:any = this.props;
        return (
            <FlatList
                keyboardShouldPersistTaps={'handled'}
                data={list}
                {...other}
            />
        );
    }
}

const mapStateToProps = (state:any) => ({});
export default connect(mapStateToProps)(Index);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


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
