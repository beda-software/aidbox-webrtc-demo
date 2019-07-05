import { StyleSheet } from "react-native";


const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
  },
  rtcView: {
    flex: 1,
    width: '90%',
    marginTop: 10,
    backgroundColor: 'lightgrey',
    borderColor: '#000',
    borderWidth: 1,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    height: 40,
  }
});

export default s;
