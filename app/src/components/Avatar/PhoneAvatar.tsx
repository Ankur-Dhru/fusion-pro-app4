import React from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const Avatar = (props:any) => {
    const renderImage = () => {
        const {img, width, height, roundedImage}:any = props;
        const {imageContainer, image}:any = styles;

        const viewStyle = [imageContainer];
        if (roundedImage)
            viewStyle.push({borderRadius: 20});
        return (
            <View style={viewStyle}>
                <Image style={image} source={img} />
            </View>
        );
    };

    const renderPlaceholder = () => {
        const {placeholder, width, height, roundedPlaceholder}:any = props;
        const {placeholderContainer, placeholderText}:any = styles;

        const viewStyle = [placeholderContainer];
        if (roundedPlaceholder)
            viewStyle.push({borderRadius: 20});

        return (
            <View style={viewStyle}>
                <View style={viewStyle}>
                    <Text>
                        {placeholder}
                    </Text>
                </View>
            </View>
        );
    };

    const {img, width, height} = props;
    const {container} = styles;
    return (
        <View style={[container, props.style, {width, height}]}>
            {img ? renderImage() : renderPlaceholder()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    imageContainer: {
        overflow: 'hidden',
        justifyContent: 'center',
        height: '100%',
    },
    image: {
        flex: 1,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined,
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dddddd',
        height: '100%',
    },
    placeholderText: {
        fontWeight: '700',
        color: '#ffffff',
    },
});

/*Avatar.propTypes = {
    img: Image.propTypes.source,
    placeholder: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    roundedImage: PropTypes.bool,
    roundedPlaceholder: PropTypes.bool,
};*/

Avatar.defaultProps = {
    roundedImage: true,
    roundedPlaceholder: true,
};

export default Avatar;
