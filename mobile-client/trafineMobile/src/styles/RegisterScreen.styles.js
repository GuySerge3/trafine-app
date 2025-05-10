import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9',
    flexGrow: 1, // ✅ avec ScrollView
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  earth: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 180,
    height: 180,
    opacity: 0.3,
    zIndex: -1,
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 32,
    textAlign: 'center',
    marginTop: 100, // ✅ évite le chevauchement avec le logo
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
    color: '#007AFF',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: "red", // temporairement visible
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});
