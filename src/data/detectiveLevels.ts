import { DetectiveLevel } from '../types';

export const DETECTIVE_LEVELS: DetectiveLevel[] = [
  {
    id: 1,
    title: 'Make the sun shine!',
    backgroundImage: 'https://picsum.photos/seed/sky/800/600',
    objects: [
      {
        id: 'sun',
        src: 'https://picsum.photos/seed/sun/100/100',
        initialPosition: { x: 80, y: 10 },
        size: { width: 20, height: 20 },
        isDraggable: true,
        initialOpacity: 0.5,
      },
      {
        id: 'cloud',
        src: 'https://picsum.photos/seed/cloud/150/100',
        initialPosition: { x: 60, y: 10 },
        size: { width: 30, height: 20 },
        isDraggable: true,
        zIndex: 2,
      },
    ],
    solution: [
      { type: 'position', objectId: 'cloud', targetArea: { x: 0, y: 70, width: 100, height: 30 } },
    ],
    solutionText: 'Move the cloud away from the sun.',
  },
  {
    id: 2,
    title: 'Find the hidden key',
    objects: [
      {
        id: 'box',
        src: 'https://picsum.photos/seed/box/150/150',
        initialPosition: { x: 40, y: 40 },
        size: { width: 20, height: 20 },
        isDraggable: false,
        isInteractable: true,
      },
      {
        id: 'key',
        src: 'https://picsum.photos/seed/key/50/50',
        initialPosition: { x: 47.5, y: 47.5 },
        size: { width: 5, height: 5 },
        isDraggable: true,
        initialOpacity: 0,
        zIndex: -1,
      },
    ],
    solution: [
      { type: 'tap', objectId: 'box', requiredTaps: 3 },
    ],
    solutionText: 'Tap the box multiple times.',
  },
];
