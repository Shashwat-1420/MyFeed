import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { Bookmark, Inbox, Bell, ArrowRight } from 'lucide-react-native';
import { useThemeColors } from '../lib/theme';

/*
 * NOTE: the web slide icons used `bg-gradient-to-tr`. React Native has no CSS
 * gradients, so each tile keeps its tint via a translucent colour overlay
 * instead (visually close, zero extra dependencies).
 */
export const OnboardingView: React.FC = () => {
  const { setScreen } = useSavedFeedStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const c = useThemeColors();

  const slides = [
    {
      Icon: Bookmark,
      tint: '#FFC800',
      iconColor: c.gold,
      heading: 'You save everything.',
      subtext: 'Articles, courses, tutorials, reels. All of it — going nowhere in your bookmarks.',
    },
    {
      Icon: Inbox,
      tint: '#3B82F6',
      iconColor: '#3B82F6',
      heading: 'SavedFeed collects them all.',
      subtext: 'One clean inbox for every link you save from Instagram, YouTube, Reddit, or the Web.',
    },
    {
      Icon: Bell,
      tint: '#4ADE80',
      iconColor: '#4ADE80',
      heading: 'We bring them back at the right time.',
      subtext: 'Smart spaced repetition nudges so you actually learn and retain what you save.',
    },
  ];

  const slide = slides[activeSlide];
  const { Icon, tint, iconColor } = slide;

  return (
    <View className="flex-1 flex-col justify-between p-6 bg-canvas">
      {/* Top brand header */}
      <View className="flex-row items-center justify-between pt-4">
        <View className="flex-row items-center gap-2">
          <View className="w-7 h-7 rounded-lg bg-gold-fill items-center justify-center">
            <Text className="text-black font-bold text-xs">SF</Text>
          </View>
          <Text className="font-bold text-sm tracking-tight text-ink">SavedFeed</Text>
        </View>
        <Pressable onPress={() => setScreen('signup')} className="active:opacity-70">
          <Text className="text-xs text-muted">Skip</Text>
        </Pressable>
      </View>

      {/* Slide content carousel */}
      <View className="flex-1 flex-col items-center justify-center px-4">
        <View
          style={{ backgroundColor: `${tint}20`, borderColor: `${tint}50` }}
          className="w-24 h-24 rounded-3xl border items-center justify-center mb-8 shadow-glow"
        >
          <Icon size={48} color={iconColor} />
        </View>
        <Text className="text-2xl font-bold text-ink mb-3 leading-tight max-w-[280px] text-center">
          {slide.heading}
        </Text>
        <Text className="text-xs text-muted max-w-[290px] leading-relaxed text-center">
          {slide.subtext}
        </Text>
      </View>

      {/* Bottom controls */}
      <View className="pb-6 gap-6">
        {/* Progress dots */}
        <View className="flex-row items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <Pressable
              key={idx}
              onPress={() => setActiveSlide(idx)}
              className={`h-2 rounded-full ${activeSlide === idx ? 'w-8 bg-gold-fill' : 'w-2 bg-edge'}`}
            />
          ))}
        </View>

        {/* CTA Button */}
        {activeSlide === 2 ? (
          <Pressable
            onPress={() => setScreen('signup')}
            className="w-full h-[52px] bg-gold-fill rounded-xl flex-row items-center justify-center gap-2 shadow-glow active:opacity-80"
          >
            <Text className="text-black font-semibold text-sm">Get Started</Text>
            <ArrowRight size={16} color="#000000" />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setActiveSlide((prev) => prev + 1)}
            className="w-full h-[52px] bg-chip border border-edge rounded-xl flex-row items-center justify-center gap-2 active:opacity-80"
          >
            <Text className="text-ink font-semibold text-sm">Next</Text>
            <ArrowRight size={16} color={c.muted} />
          </Pressable>
        )}

        <View className="items-center">
          <Pressable onPress={() => setScreen('signup')} className="active:opacity-70">
            <Text className="text-xs text-muted">
              Already have an account? <Text className="text-gold font-semibold">Log in</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};