# Payment Gateway Images

This folder contains the payment gateway images used in the checkout and enrollment pages.

## Required Images

Please save the payment gateway banner images in this folder with the following names:

1. **payment-methods-light.png** - For light mode display
   - Shows all accepted payment methods (Visa, Mastercard, Amex, bKash, Nagad, Rocket, etc.)
   - Verified by EPS logo on white/light background

2. **payment-methods-dark.png** - For dark mode display
   - Shows all accepted payment methods (Visa, Mastercard, Amex, bKash, Nagad, Rocket, etc.)
   - Verified by EPS logo on dark background

## Image Specifications

- **Format**: PNG (with transparency support)
- **Recommended Width**: 600px (will scale responsively)
- **Recommended Height**: 100-150px
- **Quality**: High resolution for clarity on all devices

## Usage

These images are automatically displayed in:
- `/academy/enroll/[slug]` - Course enrollment page
- `/shopping/checkout` - Product checkout page

The appropriate image (light or dark) is automatically selected based on the user's color mode preference.
