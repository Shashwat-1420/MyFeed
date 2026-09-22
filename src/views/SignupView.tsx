import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { Bookmark, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react-native';
import { useThemeColors } from '../lib/theme';

export const SignupView: React.FC = () => {
  const { setScreen } = useSavedFeedStore();
  const c = useThemeColors();
  const [email, setEmail] = useState('arjun.sharma@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setScreen('tabs');
    }, 400);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-between p-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="pt-6 items-center">
          <View className="w-16 h-16 rounded-2xl bg-gold/20 border border-gold/40 items-center justify-center mb-4 shadow-glow">
            <Bookmark size={32} color={c.gold} />
          </View>
          <Text className="text-xl font-bold text-ink">Create your account</Text>
          <Text className="text-xs text-muted mt-1">Start organizing your saves with AI</Text>
        </View>

        {/* Form */}
        <View className="gap-4 max-w-[320px] mx-auto w-full my-6">
          <View>
            <Text className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
              Email address
            </Text>
            <View className="relative justify-center">
              <View className="absolute left-3.5 z-10">
                <Mail size={16} color={c.dim} />
              </View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={c.dim}
                className="w-full h-11 bg-chip border border-edge rounded-xl pl-10 pr-4 text-xs text-ink"
              />
            </View>
          </View>

          <View>
            <Text className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
              Password
            </Text>
            <View className="relative justify-center">
              <View className="absolute left-3.5 z-10">
                <Lock size={16} color={c.dim} />
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={c.dim}
                className="w-full h-11 bg-chip border border-edge rounded-xl pl-10 pr-10 text-xs text-ink"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 z-10"
              >
                {showPassword ? <EyeOff size={16} color={c.dim} /> : <Eye size={16} color={c.dim} />}
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.6 : 1 }}
            className="w-full h-[52px] rounded-xl flex-row items-center justify-center gap-2 shadow-glow mt-6 bg-gold-fill active:opacity-80"
          >
            {isSubmitting ? (
              <Text className="text-black font-semibold text-xs">Creating account...</Text>
            ) : (
              <>
                <Text className="text-black font-semibold text-xs">Sign Up & Continue</Text>
                <ArrowRight size={16} color="#000000" />
              </>
            )}
          </Pressable>
        </View>

        {/* Footer */}
        <View className="items-center pb-6">
          <Pressable onPress={() => setScreen('tabs')} className="active:opacity-70">
            <Text className="text-xs text-muted">
              Already have an account? <Text className="text-gold font-semibold">Log in</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};