import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,  // Ajuste le padding pour iOS avec encoche
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,  // Espace supplémentaire pour les appareils iOS avec encoche
  },
  profileSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    flexDirection: 'row', // Gérer l'alignement de l'icône et du texte
    alignItems: 'center',
  },
  profileInfo: {
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10, // Ajout d'espace entre l'icône et l'email
  },
  changePasswordSection: {
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    marginTop: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#d00',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
