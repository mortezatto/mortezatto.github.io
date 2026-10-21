---
layout: project
title: "Handwritten Digit & Facial Emotion Recognition"
subtitle: "Deep learning models for recognizing handwritten numbers and identifying human facial emotional states."
description: "Deep learning models for recognizing handwritten numbers and identifying human facial emotional states, exploring early computer-vision architectures for classification tasks."
tag: "B.Sc. Thesis · 2019"
status: "completed"
order: 3
tags: ["Computer Vision", "CNNs", "Emotion Recognition"]
math: false
body_class: "project-detail-page"
links: {}
---

## Overview

This was my B.Sc. thesis at the University of Gonabad, supervised by Dr. Havva Alizadeh
Noughabi: two classification tasks — recognizing handwritten digits and identifying human
facial emotional states — using early convolutional neural network architectures.

## Approach

For handwritten digit recognition, the focus was on building and tuning a CNN classifier from
first principles: understanding how convolutional and pooling layers extract increasingly
abstract features from raw pixel input, and how architectural choices (depth, filter size,
regularization) trade off against training stability and generalization on a relatively small
dataset.

For facial emotion recognition, the same convolutional foundation was extended to a harder
problem: emotional expression is far more variable and subjective than a handwritten digit, so
the project also involved working through how preprocessing (face alignment, normalization) and
class imbalance in emotion datasets affect what a CNN actually learns to key on.

## Reflection

This project was where I first worked hands-on with the deep learning fundamentals — CNNs,
loss functions, training dynamics — that everything since (the TL-CGAN work, the segmentation
collaboration) has built on. It's a good example of starting with the basics: classic
computer-vision classification tasks, before moving into medical imaging and adversarial
robustness.
