
import React, { useState } from 'react';
import { View, Modal, TextInput, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from './themed-text';
import { report } from '@/services/reportingService';
import { useMutation } from '@tanstack/react-query';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'user' | 'media' | 'event';
  id: string;
}

const REPORT_REASONS = [
  'Spam',
  'Nudity or sexual activity',
  'Hate speech or symbols',
  'False information',
  'Bullying or harassment',
  'Scam or fraud',
  'Violence or dangerous organizations',
  'Intellectual property violation',
  'Sale of illegal or regulated goods',
  'Suicide or self-injury',
  'Something else',
];

export function ReportModal({ visible, onClose, type, id }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');

  const reportMutation = useMutation({
    mutationFn: () => report(type, id, reason, comments),
    onSuccess: () => {
      onClose();
      // TODO: Show success toast
    },
    onError: () => {
      // TODO: Show error toast
    },
  });

  const handleReport = () => {
    if (reason) {
      reportMutation.mutate();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ThemedText style={styles.modalTitle}>Report</ThemedText>
          <FlatList
            data={REPORT_REASONS}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.reasonItem, reason === item && styles.selectedReason]}
                onPress={() => setReason(item)}
              >
                <ThemedText>{item}</ThemedText>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
          <TextInput
            style={styles.commentsInput}
            placeholder="Additional comments..."
            placeholderTextColor="#9CA3AF"
            value={comments}
            onChangeText={setComments}
          />
          <Button title="Submit" onPress={handleReport} disabled={!reason || reportMutation.isPending} />
          <Button title="Cancel" onPress={onClose} color="#FF5A5F" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reasonItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#050406',
  },
  selectedReason: {
    backgroundColor: '#7C3AED',
  },
  commentsInput: {
    backgroundColor: '#050406',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
});
