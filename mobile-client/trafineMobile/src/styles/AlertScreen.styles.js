import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  alertCard: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default styles;
