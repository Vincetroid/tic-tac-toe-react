
const helpers = {
    goToModal: function(modalScreen, iconName, screenModalMessage, nextScreen, props){

        // const navigateAction = NavigationActions.navigate({
        //     routeName: modalScreen,
        //     params: {
        //         iconName: iconName,
        //         screenModalMessage: screenModalMessage,
        //         nextScreen: nextScreen,
        //     }
        // });
        // props.navigation.dispatch(navigateAction);

    },
    transformStringToDate(string){
        const ms = Date.parse(string);
        const date = new Date(ms);
        return date;
    },
    transformDateToDDMMYYY(date){
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        return day + '/' + month + '/' + date.getFullYear();
    }
}

export default helpers;