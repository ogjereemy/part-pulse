import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

const steps = ['Details', 'Time', 'Location', 'More'];

export default function HostScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 />;
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View key={index} style={[styles.step, index <= currentStep && styles.activeStep]} />
        ))}
      </View>
      <Animated.View style={{ flex: 1 }} layout={Layout.springify()}>
        {renderStep()}
      </Animated.View>
      <View style={styles.navigationContainer}>
        {currentStep > 0 && (
          <TouchableOpacity onPress={prevStep} style={styles.navButton}>
            <ThemedText>Back</ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={nextStep} style={[styles.navButton, styles.nextButton]}>
          <ThemedText style={{ color: 'white' }}>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const Step1 = () => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepContainer}>
    <ThemedText type="title">Event Details</ThemedText>
    <TextInput placeholder="Event Title" style={styles.input} placeholderTextColor={Colors.dark.text} />
    <TextInput placeholder="Category" style={styles.input} placeholderTextColor={Colors.dark.text} />
    <TouchableOpacity style={styles.imagePicker}>
      <ThemedText>+ Upload Cover Image</ThemedText>
    </TouchableOpacity>
  </Animated.View>
);

const Step2 = () => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepContainer}>
    <ThemedText type="title">Date & Time</ThemedText>
    <TextInput placeholder="Start Time" style={styles.input} placeholderTextColor={Colors.dark.text} />
    <TextInput placeholder="End Time" style={styles.input} placeholderTextColor={Colors.dark.text} />
  </Animated.View>
);

const Step3 = () => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepContainer}>
    <ThemedText type="title">Location</ThemedText>
    <View style={styles.mapPlaceholder}>
      <ThemedText>Map placeholder</ThemedText>
    </View>
  </Animated.View>
);

const Step4 = () => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepContainer}>
    <ThemedText type="title">Additional Details</ThemedText>
    <TextInput placeholder="Description" style={[styles.input, { height: 100 }]} multiline placeholderTextColor={Colors.dark.text} />
    <TextInput placeholder="Price" style={styles.input} keyboardType="numeric" placeholderTextColor={Colors.dark.text} />
    <TextInput placeholder="Rules" style={styles.input} placeholderTextColor={Colors.dark.text} />
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: Colors.dark.background,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  step: {
    flex: 1,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 2.5,
    marginHorizontal: 2,
  },
  activeStep: {
    backgroundColor: Colors.dark.tint,
  },
  stepContainer: {
    flex: 1,
  },
  input: {
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: Colors.dark.text,
    fontSize: 16,
  },
  imagePicker: {
    height: 150,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  navButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  nextButton: {
    backgroundColor: Colors.dark.tint,
    marginLeft: 10,
  },
});
