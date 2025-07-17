# Design Specification

## Overview

This document outlines the design principles, UI components, and visual guidelines for the Subscription Tracker application.

## Design Principles

1. **Simplicity**: Clean, uncluttered interfaces that focus on content and functionality
2. **Consistency**: Uniform design patterns across the application
3. **Accessibility**: WCAG 2.1 AA compliant design elements
4. **Responsiveness**: Fluid layouts that work across devices and screen sizes
5. **Visual Hierarchy**: Clear distinction between primary and secondary elements

## Color Palette

### Primary Colors

- **Primary**: `#3B82F6` (Blue)
- **Primary Dark**: `#2563EB`
- **Primary Light**: `#93C5FD`

### Secondary Colors

- **Secondary**: `#10B981` (Green)
- **Secondary Dark**: `#059669`
- **Secondary Light**: `#6EE7B7`

### Neutral Colors

- **Background**: `#FFFFFF`
- **Background Alt**: `#F9FAFB`
- **Text Primary**: `#111827`
- **Text Secondary**: `#6B7280`
- **Border**: `#E5E7EB`

### Semantic Colors

- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`
- **Info**: `#3B82F6`

## Typography

### Font Family

- **Primary Font**: Inter, sans-serif
- **Monospace Font**: JetBrains Mono, monospace (for code or numeric data)

### Font Sizes

- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

### Font Weights

- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Spacing System

Using a 4px base unit (0.25rem):

- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

## Border Radius

- **sm**: 0.125rem (2px)
- **default**: 0.25rem (4px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px)
- **xl**: 0.75rem (12px)
- **full**: 9999px (for circular elements)

## Shadows

- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **default**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

## UI Components

### Core Components (Shadcn UI)

- **Buttons**: Primary, Secondary, Outline, Ghost, Link
- **Inputs**: Text, Number, Date, Select, Checkbox, Radio
- **Feedback**: Alert, Toast, Dialog, Popover
- **Navigation**: Tabs, Breadcrumbs, Pagination
- **Layout**: Card, Container, Grid, Divider
- **Data Display**: Table, Badge, Avatar, Progress

### Custom Components

#### Subscription Card

- Displays subscription details in a card format
- Shows name, amount, renewal date, and provider
- Includes quick actions (edit, delete)
- Visual indicator for auto-renewal status

#### Analytics Widget

- Configurable widget for displaying analytics data
- Supports various chart types (bar, line, pie)
- Includes filtering and time range selection
- Responsive design that adapts to container size

#### Calendar View

- Monthly calendar displaying subscription renewals
- Color-coded by subscription category
- Hover tooltips with subscription details
- Quick-action buttons for managing displayed subscriptions

#### Plan Feature Gate

- Component that conditionally renders features based on user's plan
- Includes upgrade prompts for unavailable features
- Smooth transitions between plan-specific views

## Page Layouts

### Dashboard Layout

- **Header**: App logo, navigation menu, user profile
- **Sidebar**: Main navigation, quick filters
- **Main Content**: Dashboard widgets, subscription list
- **Footer**: Links, copyright information

### Subscription Detail Layout

- **Header**: Subscription name, back button
- **Main Content**: Subscription details, linked invoices
- **Sidebar**: Actions, related subscriptions

### Settings Layout

- **Header**: Page title
- **Sidebar**: Settings categories
- **Main Content**: Settings form or display

## Responsive Design

### Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile Adaptations

- Sidebar collapses to bottom navigation or hamburger menu
- Cards stack vertically instead of grid layout
- Tables convert to card view on small screens
- Touch-friendly tap targets (min 44x44px)

## Animation Guidelines

- **Duration**: 150-300ms for most transitions
- **Easing**: Use ease-in-out for smooth transitions
- **Purpose**: Animations should provide feedback and guide attention
- **Accessibility**: Respect reduced motion preferences

## Icons

- **Icon Set**: Lucide React Icons
- **Sizes**: 16px, 20px, 24px (default), 32px
- **Usage**: Consistent icon usage for similar actions across the app

## Design Assets

- Design files are stored in Figma
- Component library is implemented using Shadcn UI
- Custom components extend the base Shadcn UI system

## Accessibility Guidelines

- Minimum contrast ratio of 4.5:1 for normal text
- Keyboard navigable interface
- Proper ARIA attributes on interactive elements
- Support for screen readers
- Focus indicators for keyboard navigation

## Implementation Notes

- Use Tailwind CSS for styling
- Implement dark mode using Tailwind's dark mode feature
- Use CSS variables for theme colors to support theming
- Ensure responsive behavior using Tailwind's responsive utilities

---

*Note: This design specification should be used in conjunction with the Shadcn UI documentation and Tailwind CSS guidelines.*