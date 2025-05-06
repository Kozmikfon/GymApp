export type RootStackParamList = {
    AuthStack: undefined;
    Login: undefined;
    Register: undefined;
    Home: undefined;
    InitialQuestions: undefined;
    AdminDashboard:undefined;
    HomeDrawer:undefined;
    ExerciseDetail:{exercise:undefined};
}


export type ScreenNames=keyof RootStackParamList;