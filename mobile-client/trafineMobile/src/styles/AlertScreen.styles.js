import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  alertCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
    padding: 16
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 24
  },
  list: {
    gap: 12
  },
  message: {
    fontSize: 16,
    fontWeight: '500'
  },
  timestamp: {
    color: '#777',
    fontSize: 14,
    marginTop: 4
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16
  }
});

export default styles;

