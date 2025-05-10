import { StyleSheet } from "react-native";

export default StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    marginTop: 10,
    overflow: "hidden",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    backgroundColor: "#F9F9F9",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  earth: {
    bottom: 0,
    height: 180,
    opacity: 17,
    position: "absolute",
    right: 0,
    width: 180,
  },
  
  icon: {
    marginRight: 8,
    color: '#007AFF',
  },
  
  
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DDD",
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  logoContainer: {
    left: 24,
    position: "absolute",
    top: 50,
  },
  title: {
    color: "#007AFF",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
});
