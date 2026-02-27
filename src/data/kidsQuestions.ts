export interface KidsQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const KIDS_QUESTIONS: KidsQuestion[] = [
  // 1. Colors & Shapes
  { id: 'k1', topic: 'Colors & Shapes', difficulty: 'Easy', question: 'What color is an apple?', options: ['Red', 'Blue', 'Purple', 'Black'], answer: 'Red' },
  { id: 'k2', topic: 'Colors & Shapes', difficulty: 'Easy', question: 'Which shape has 3 sides?', options: ['Square', 'Circle', 'Triangle', 'Star'], answer: 'Triangle' },
  { id: 'k3', topic: 'Colors & Shapes', difficulty: 'Medium', question: 'What color do you get when you mix red and yellow?', options: ['Green', 'Orange', 'Purple', 'Brown'], answer: 'Orange' },
  { id: 'k4', topic: 'Colors & Shapes', difficulty: 'Medium', question: 'Which shape looks like an egg?', options: ['Oval', 'Square', 'Rectangle', 'Diamond'], answer: 'Oval' },
  { id: 'k5', topic: 'Colors & Shapes', difficulty: 'Hard', question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answer: '6' },

  // 2. Animals
  { id: 'k6', topic: 'Animals', difficulty: 'Easy', question: 'What animal says "Moo"?', options: ['Dog', 'Cat', 'Cow', 'Sheep'], answer: 'Cow' },
  { id: 'k7', topic: 'Animals', difficulty: 'Easy', question: 'Which animal has a long trunk?', options: ['Giraffe', 'Elephant', 'Monkey', 'Lion'], answer: 'Elephant' },
  { id: 'k8', topic: 'Animals', difficulty: 'Medium', question: 'What do pandas love to eat?', options: ['Bamboo', 'Fish', 'Carrots', 'Apples'], answer: 'Bamboo' },
  { id: 'k9', topic: 'Animals', difficulty: 'Medium', question: 'Which bird can swim but cannot fly?', options: ['Eagle', 'Penguin', 'Parrot', 'Owl'], answer: 'Penguin' },
  { id: 'k10', topic: 'Animals', difficulty: 'Hard', question: 'What is a baby kangaroo called?', options: ['Calf', 'Cub', 'Joey', 'Kid'], answer: 'Joey' },

  // 3. Numbers & Counting
  { id: 'k11', topic: 'Numbers & Counting', difficulty: 'Easy', question: 'How many fingers do you have on one hand?', options: ['3', '4', '5', '6'], answer: '5' },
  { id: 'k12', topic: 'Numbers & Counting', difficulty: 'Easy', question: 'What comes after the number 2?', options: ['1', '3', '4', '5'], answer: '3' },
  { id: 'k13', topic: 'Numbers & Counting', difficulty: 'Medium', question: 'If you have 2 apples and get 2 more, how many do you have?', options: ['2', '3', '4', '5'], answer: '4' },
  { id: 'k14', topic: 'Numbers & Counting', difficulty: 'Medium', question: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], answer: '8' },
  { id: 'k15', topic: 'Numbers & Counting', difficulty: 'Hard', question: 'What is 10 minus 3?', options: ['6', '7', '8', '9'], answer: '7' },

  // 4. Fruits & Veggies
  { id: 'k16', topic: 'Fruits & Veggies', difficulty: 'Easy', question: 'Which fruit is yellow and curved?', options: ['Apple', 'Banana', 'Grape', 'Orange'], answer: 'Banana' },
  { id: 'k17', topic: 'Fruits & Veggies', difficulty: 'Easy', question: 'What vegetable do rabbits love to eat?', options: ['Carrot', 'Potato', 'Onion', 'Corn'], answer: 'Carrot' },
  { id: 'k18', topic: 'Fruits & Veggies', difficulty: 'Medium', question: 'Which fruit has seeds on the outside?', options: ['Strawberry', 'Watermelon', 'Peach', 'Plum'], answer: 'Strawberry' },
  { id: 'k19', topic: 'Fruits & Veggies', difficulty: 'Medium', question: 'What color is a ripe tomato?', options: ['Green', 'Blue', 'Red', 'Purple'], answer: 'Red' },
  { id: 'k20', topic: 'Fruits & Veggies', difficulty: 'Hard', question: 'Which of these is actually a fruit, not a vegetable?', options: ['Carrot', 'Broccoli', 'Pumpkin', 'Spinach'], answer: 'Pumpkin' },

  // 5. Vehicles & Transport
  { id: 'k21', topic: 'Vehicles', difficulty: 'Easy', question: 'What vehicle flies in the sky?', options: ['Car', 'Boat', 'Airplane', 'Train'], answer: 'Airplane' },
  { id: 'k22', topic: 'Vehicles', difficulty: 'Easy', question: 'What vehicle goes "Choo Choo"?', options: ['Bus', 'Train', 'Truck', 'Bicycle'], answer: 'Train' },
  { id: 'k23', topic: 'Vehicles', difficulty: 'Medium', question: 'How many wheels does a bicycle have?', options: ['1', '2', '3', '4'], answer: '2' },
  { id: 'k24', topic: 'Vehicles', difficulty: 'Medium', question: 'What do you use to row a boat?', options: ['Steering wheel', 'Pedals', 'Oars', 'Wings'], answer: 'Oars' },
  { id: 'k25', topic: 'Vehicles', difficulty: 'Hard', question: 'What vehicle travels to outer space?', options: ['Submarine', 'Helicopter', 'Rocket', 'Hovercraft'], answer: 'Rocket' },

  // 6. Body Parts
  { id: 'k26', topic: 'Body Parts', difficulty: 'Easy', question: 'What do you use to see?', options: ['Nose', 'Ears', 'Eyes', 'Mouth'], answer: 'Eyes' },
  { id: 'k27', topic: 'Body Parts', difficulty: 'Easy', question: 'What do you use to smell a flower?', options: ['Nose', 'Ears', 'Hands', 'Feet'], answer: 'Nose' },
  { id: 'k28', topic: 'Body Parts', difficulty: 'Medium', question: 'Where is your knee?', options: ['On your arm', 'On your leg', 'On your head', 'On your back'], answer: 'On your leg' },
  { id: 'k29', topic: 'Body Parts', difficulty: 'Medium', question: 'What connects your head to your body?', options: ['Shoulder', 'Neck', 'Elbow', 'Ankle'], answer: 'Neck' },
  { id: 'k30', topic: 'Body Parts', difficulty: 'Hard', question: 'What is the hard part inside your body that gives it shape?', options: ['Muscles', 'Skin', 'Bones', 'Blood'], answer: 'Bones' },

  // 7. Daily Objects
  { id: 'k31', topic: 'Daily Objects', difficulty: 'Easy', question: 'What do you use to brush your teeth?', options: ['Hairbrush', 'Toothbrush', 'Spoon', 'Pencil'], answer: 'Toothbrush' },
  { id: 'k32', topic: 'Daily Objects', difficulty: 'Easy', question: 'What do you sleep on at night?', options: ['Table', 'Chair', 'Bed', 'Floor'], answer: 'Bed' },
  { id: 'k33', topic: 'Daily Objects', difficulty: 'Medium', question: 'What do you use to cut paper?', options: ['Spoon', 'Scissors', 'Glue', 'Tape'], answer: 'Scissors' },
  { id: 'k34', topic: 'Daily Objects', difficulty: 'Medium', question: 'What keeps you dry in the rain?', options: ['Sunglasses', 'Umbrella', 'Scarf', 'Gloves'], answer: 'Umbrella' },
  { id: 'k35', topic: 'Daily Objects', difficulty: 'Hard', question: 'What object tells you the time?', options: ['Calendar', 'Compass', 'Clock', 'Thermometer'], answer: 'Clock' },

  // 8. Nature & Weather
  { id: 'k36', topic: 'Nature', difficulty: 'Easy', question: 'What is hot and shines in the sky during the day?', options: ['Moon', 'Star', 'Sun', 'Cloud'], answer: 'Sun' },
  { id: 'k37', topic: 'Nature', difficulty: 'Easy', question: 'What falls from the clouds when it is wet outside?', options: ['Snow', 'Rain', 'Leaves', 'Rocks'], answer: 'Rain' },
  { id: 'k38', topic: 'Nature', difficulty: 'Medium', question: 'What do caterpillars turn into?', options: ['Spiders', 'Butterflies', 'Beetles', 'Worms'], answer: 'Butterflies' },
  { id: 'k39', topic: 'Nature', difficulty: 'Medium', question: 'What is the colorful arc in the sky after it rains?', options: ['Cloud', 'Lightning', 'Rainbow', 'Tornado'], answer: 'Rainbow' },
  { id: 'k40', topic: 'Nature', difficulty: 'Hard', question: 'What do bees collect from flowers to make honey?', options: ['Water', 'Nectar', 'Leaves', 'Dirt'], answer: 'Nectar' },

  // 9. Sounds
  { id: 'k41', topic: 'Sounds', difficulty: 'Easy', question: 'Which animal says "Meow"?', options: ['Dog', 'Cat', 'Bird', 'Mouse'], answer: 'Cat' },
  { id: 'k42', topic: 'Sounds', difficulty: 'Easy', question: 'Which animal says "Quack"?', options: ['Pig', 'Horse', 'Duck', 'Chicken'], answer: 'Duck' },
  { id: 'k43', topic: 'Sounds', difficulty: 'Medium', question: 'What sound does a clock make?', options: ['Ding Dong', 'Tick Tock', 'Beep Beep', 'Ring Ring'], answer: 'Tick Tock' },
  { id: 'k44', topic: 'Sounds', difficulty: 'Medium', question: 'What sound does a sheep make?', options: ['Baa', 'Moo', 'Oink', 'Neigh'], answer: 'Baa' },
  { id: 'k45', topic: 'Sounds', difficulty: 'Hard', question: 'What sound does a snake make?', options: ['Roar', 'Hiss', 'Chirp', 'Growl'], answer: 'Hiss' },

  // 10. Emotions & Feelings
  { id: 'k46', topic: 'Emotions', difficulty: 'Easy', question: 'How do you feel when you get a present?', options: ['Sad', 'Angry', 'Happy', 'Sleepy'], answer: 'Happy' },
  { id: 'k47', topic: 'Emotions', difficulty: 'Easy', question: 'How do you feel when you drop your ice cream?', options: ['Happy', 'Sad', 'Excited', 'Silly'], answer: 'Sad' },
  { id: 'k48', topic: 'Emotions', difficulty: 'Medium', question: 'What do you do when something is very funny?', options: ['Cry', 'Yell', 'Laugh', 'Sleep'], answer: 'Laugh' },
  { id: 'k49', topic: 'Emotions', difficulty: 'Medium', question: 'How do you feel when it is dark and you hear a scary noise?', options: ['Bored', 'Frightened', 'Hungry', 'Thirsty'], answer: 'Frightened' },
  { id: 'k50', topic: 'Emotions', difficulty: 'Hard', question: 'How do you feel when you have been running a lot and need water?', options: ['Tired', 'Thirsty', 'Angry', 'Cold'], answer: 'Thirsty' },
];

export const getRandomKidsQuestions = (count: number): KidsQuestion[] => {
  const shuffled = [...KIDS_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
