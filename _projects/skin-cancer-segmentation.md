---
layout: project
title: "Histopathological Skin Cancer Segmentation"
subtitle: "A deep neural network approach to segmenting malignant tissue in histopathological skin cancer images."
description: "A deep neural network approach to segmenting malignant tissue in histopathological skin cancer images, developed with a multi-institution research team as part of ongoing medical imaging work."
tag: "Collaborative Research · 2024"
status: "In progress"
order: 2
tags: ["Semantic Segmentation", "Medical Imaging", "Deep Learning"]
thumbnail: /assets/img/covers/pub-skincancer.png
math: false
body_class: "project-detail-page"
links:
  paper: "/publications/#pub-skincancer"
---

## Overview

Accurate delineation of malignant tissue in histopathological whole-slide images is a
prerequisite for reliable computer-assisted skin cancer diagnosis — but manual annotation by
pathologists is slow, and different annotators don't always agree on exactly where a boundary
falls. This ongoing collaborative project, developed with a multi-institution research team,
builds a deep neural network pipeline to segment malignant regions directly from
histopathological slide images.

## Approach

The pipeline combines a convolutional encoder-decoder segmentation architecture with
domain-specific pre-processing to handle the color and staining variability that's typical
across histopathology datasets collected from different labs and scanners. Getting this
pre-processing right matters more than it might seem — stain variation between institutions is
often a bigger source of error for a segmentation model than the actual tissue morphology it's
trying to learn.

## Collaboration

This work is a joint effort across several contributors and institutions — Pantea Shirali,
Mahdi Bohlouli, S. Fietz, J. Landsberg, and A. Akagic — bringing together clinical, imaging, and
machine learning expertise. My contribution has focused on the segmentation model itself and
the evaluation pipeline.

## Status

The manuscript is currently in progress. Preliminary results on held-out slides show
segmentation masks that closely track expert annotations, and the collaboration is ongoing to
extend the dataset and validate the pipeline across additional clinical sites. The abstract and
citation are on the [Publications page](/publications/#pub-skincancer).
