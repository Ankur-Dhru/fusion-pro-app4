import {
    Button,
    Title,
    Paragraph,
} from 'react-native-paper';
import {
    Tabs,
    TabScreen,
    useTabIndex,
    useTabNavigation,
} from 'react-native-paper-tabs';
import {View} from "react-native";

function Example() {
    return (
        <Tabs
            // defaultIndex={0} // default = 0
            // uppercase={false} // true/false | default=true | labels are uppercase
            // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
            // iconPosition // leading, top | default=leading
            // style={{ backgroundColor:'#fff' }} // works the same as AppBar in react-native-paper
            // dark={false} // works the same as AppBar in react-native-paper
            // theme={} // works the same as AppBar in react-native-paper
            // mode="scrollable" // fixed, scrollable | default=fixed
            // onChangeIndex={(newIndex) => {}} // react on index change
            // showLeadingSpace={true} //  (default=true) show leading space in scrollable tabs inside the header
        >
            <TabScreen label="Explore" icon="compass">
                <ExploreWitHookExamples />
            </TabScreen>
            <TabScreen label="Flights" icon="airplane">
                <View style={{ backgroundColor: 'black', flex:1 }} />
            </TabScreen>
            <TabScreen label="Trips" icon="bag-suitcase">
                <View style={{ backgroundColor: 'red', flex:1 }} />
            </TabScreen>
        </Tabs>
    )
}

function ExploreWitHookExamples() {
    const goTo = useTabNavigation();
    const index = useTabIndex();
    return (
        <View style={{ flex:1 }}>
            <Title>Explore</Title>
            <Paragraph>Index: {index}</Paragraph>
            <Button onPress={() => goTo(1)}>Go to Flights</Button>
        </View>
    );
}
