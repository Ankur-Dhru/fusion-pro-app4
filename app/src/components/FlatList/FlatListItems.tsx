import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, ScrollView, Image, RefreshControl} from 'react-native';
import {connect} from "react-redux";
import Search from "../SearchBox";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import ListLoader from "../ContentLoader/ListLoader";
import NoResultFound from "../NoResultFound";

class Index extends Component<any, any> {

    render() {
        const {data,renderItem,onRefresh,handleSearch,keyExt,isLoading,ListHeaderComponent,disableSearchbar,disabledefaultload,loadMore,theme:{colors}}:any = this.props;

        if(!isLoading){
            return <ListLoader  />
        }

        let headerComponent = !disableSearchbar ? <Search autoFocus={false} placeholder={`Search...`}    handleSearch = {handleSearch}/> : <View></View>

        return (

            <View style={[{backgroundColor:colors.surface}]}>
                <FlatList
                    data={data || []}
                    renderItem={renderItem}
                    keyboardShouldPersistTaps={'handled'}
                    scrollIndicatorInsets={{ right: 1 }}
                    keyExtractor={item => Boolean(item) && item[keyExt]}

                    initialNumToRender = {50}
                    ListHeaderComponent={ListHeaderComponent || headerComponent}
                    stickyHeaderIndices={[0]}
                    stickyHeaderHiddenOnScroll={true}
                    invertStickyHeaders={false}
                    onEndReachedThreshold={0.5}
                    progressViewOffset={100}
                    ListEmptyComponent={<View style={[styles.center,styles.middle]}>
                        <NoResultFound/>
                        <Paragraph style={[styles.paragraph,]}>No Records Found</Paragraph>
                    </View>}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={onRefresh}
                        />
                    }
                    onEndReached={({distanceFromEnd}:any) => {
                        if(distanceFromEnd > 100) {Boolean(loadMore) && loadMore()}
                    }}

                />
            </View>


        );
    }
}

const mapStateToProps = (state:any) => ({});
export default connect(mapStateToProps)(withTheme(Index));

