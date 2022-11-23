import React, { Component } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import {connect} from "react-redux";

class Index extends Component {
    render() {
        const {list}:any = this.props;
        // @ts-ignore
        return (
            <View style={styles.container}>
                <SectionList
                    sections={list}
                    keyboardShouldPersistTaps={'handled'}
                    renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
                    renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                />
            </View>
        );
    }
}

const mapStateToProps = (state:any) => ({

})
export default  connect(mapStateToProps)(Index);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})




    /*<SectionList list={[
        {title: 'D', data: ['Devin', 'Dan', 'Dominic','Devin', 'Dan', 'Dominic','Devin', 'Dan', 'Dominic']},
{title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']},
]}/>*/
