import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, Clock } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

type FreeTimeSlotsModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  workingHours: {
    start: string;
    end: string;
    closed: boolean;
  };
  onSelectSlot: (startTime: string, endTime: string) => void;
  excludeAppointmentId?: string;
};

type TimeSlot = {
  startTime: string;
  endTime: string;
};

export default function FreeTimeSlotsModal({
  visible,
  onClose,
  selectedDate,
  workingHours,
  onSelectSlot,
  excludeAppointmentId,
}: FreeTimeSlotsModalProps) {
  const [freeSlots, setFreeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadFreeSlots();
    }
  }, [visible, selectedDate]);

  const loadFreeSlots = async () => {
    if (workingHours.closed) {
      setFreeSlots([]);
      return;
    }

    setLoading(true);
    try {
      console.log('FreeTimeSlotsModal - selectedDate object:', selectedDate);
      console.log('FreeTimeSlotsModal - selectedDate ISO:', selectedDate.toISOString());
      console.log('FreeTimeSlotsModal - selectedDate local:', selectedDate.toLocaleDateString());

      const dateStr = selectedDate.toISOString().split('T')[0];
      console.log('Loading free slots for date:', dateStr);
      console.log('Exclude appointment ID:', excludeAppointmentId);

      let query = supabase
        .from('appointments')
        .select('id, start_time::text, end_time::text, appointment_date')
        .eq('appointment_date', dateStr)
        .neq('status', 'cancelled');

      if (excludeAppointmentId) {
        query = query.neq('id', excludeAppointmentId);
      }

      const { data: appointments, error } = await query;

      console.log('Raw appointments from DB:', appointments);
      console.log('Query error:', error);

      if (error) throw error;

      const slots = calculateFreeSlots(appointments || []);
      setFreeSlots(slots);
    } catch (error) {
      console.error('Error loading free slots:', error);
      setFreeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateFreeSlots = (appointments: any[]): TimeSlot[] => {
    console.log('=== CALCULATING FREE SLOTS ===');
    console.log('Working hours:', workingHours);
    console.log('Appointments:', appointments);

    const [startHour, startMinute] = workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = workingHours.end.split(':').map(Number);

    const workStartMinutes = startHour * 60 + startMinute;
    const workEndMinutes = endHour * 60 + endMinute;

    console.log('Work start minutes:', workStartMinutes, `(${workingHours.start})`);
    console.log('Work end minutes:', workEndMinutes, `(${workingHours.end})`);

    const occupiedSlots: Array<[number, number]> = appointments
      .map(apt => {
        const startTime = apt.start_time.substring(0, 5);
        const endTime = apt.end_time.substring(0, 5);

        const [sHour, sMinute] = startTime.split(':').map(Number);
        const [eHour, eMinute] = endTime.split(':').map(Number);
        const start = sHour * 60 + sMinute;
        const end = eHour * 60 + eMinute;
        console.log(`Occupied: ${startTime} - ${endTime} (${start} - ${end})`);
        return [start, end];
      })
      .sort((a, b) => a[0] - b[0]);

    console.log('Occupied slots sorted:', occupiedSlots);

    const freeRanges: Array<[number, number]> = [];
    let currentTime = workStartMinutes;

    console.log('Starting from:', currentTime);

    for (const [start, end] of occupiedSlots) {
      console.log(`Checking slot: ${start} - ${end}, currentTime: ${currentTime}`);
      if (currentTime < start) {
        console.log(`Found free range: ${currentTime} - ${start}`);
        freeRanges.push([currentTime, start]);
      }
      currentTime = Math.max(currentTime, end);
      console.log(`Updated currentTime to: ${currentTime}`);
    }

    if (currentTime < workEndMinutes) {
      console.log(`Adding final free range: ${currentTime} - ${workEndMinutes}`);
      freeRanges.push([currentTime, workEndMinutes]);
    }

    console.log('Free ranges before filter:', freeRanges);

    const result = freeRanges
      .filter(([start, end]) => {
        const duration = end - start;
        console.log(`Range ${start} - ${end}: duration = ${duration} minutes`);
        return duration >= 30;
      })
      .map(([start, end]) => ({
        startTime: formatMinutes(start),
        endTime: formatMinutes(end),
      }));

    console.log('Final free slots:', result);
    console.log('=== END CALCULATING FREE SLOTS ===');

    return result;
  };

  const formatMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    onSelectSlot(slot.startTime, slot.endTime);
    onClose();
  };

  const getSlotDurationInHours = (startTime: string, endTime: string): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    return durationMinutes / 60;
  };

  const getSlotLabel = (slot: TimeSlot): string => {
    const durationHours = getSlotDurationInHours(slot.startTime, slot.endTime);
    const label = durationHours > 1 ? 'Свободни часове' : 'Свободен час';
    return `${label} от ${slot.startTime} до ${slot.endTime}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Свободни часове</Text>
              <Text style={styles.subtitle}>
                {selectedDate.toLocaleDateString('bg-BG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : freeSlots.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Clock size={48} color={theme.colors.textMuted} />
              <Text style={styles.emptyText}>Няма свободни часове за избраната дата</Text>
            </View>
          ) : (
            <ScrollView style={styles.slotsContainer}>
              {freeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.slotButton}
                  onPress={() => handleSelectSlot(slot)}
                >
                  <View style={styles.slotContent}>
                    <Clock size={20} color={theme.colors.primary} />
                    <Text style={styles.slotText}>
                      {getSlotLabel(slot)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    width: '100%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  loadingContainer: {
    padding: theme.spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: theme.spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  slotsContainer: {
    padding: theme.spacing.lg,
  },
  slotButton: {
    backgroundColor: theme.colors.cream,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  slotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  slotText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
});
