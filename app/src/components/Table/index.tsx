import React, { Component } from 'react';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import {connect} from "react-redux";
import {styles} from "../../theme/index";


class Index extends Component {
    render() {
        const {table}:any = this.props;
        return (

                <Card  style={[styles.box,styles.m_2]}>
                    <Card.Content>
                        <Paragraph>{table.tablename}</Paragraph>
                    </Card.Content>
                </Card>

        );
    }
}

const mapStateToProps = (state:any) => ({

})
export default  connect(mapStateToProps)(Index);





