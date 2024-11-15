import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const NotesStat = () => {
  return (
    <View style={styles.noteContainer}>
      <Text style={styles.noteTitle}>Stat Abbreviations:</Text>
      <Text style={styles.noteText}>
        <Text style={styles.noteAbbreviation}>H</Text> = HP (Health Points){' '}
        {'\n'}
        <Text style={styles.noteAbbreviation}>A</Text> = Attack {'\n'}
        <Text style={styles.noteAbbreviation}>D</Text> = Defense {'\n'}
        <Text style={styles.noteAbbreviation}>SA</Text> = Special Attack {'\n'}
        <Text style={styles.noteAbbreviation}>SD</Text> = Special Defense {'\n'}
        <Text style={styles.noteAbbreviation}>S</Text> = Speed {'\n'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noteAbbreviation: {
    fontWeight: 'bold',
    color: '#3B4CCA',
  },
});

export default NotesStat;
