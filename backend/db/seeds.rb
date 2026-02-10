people_data = [
  {
    name: "Xavier",
    slug: "xavier",
    description: "Grand Bourguignon solide, assez complet dans l’ensemble, judoka depuis toujours. Petit problème de mental malgré la volonté de courir 21 km avec un adducteur en moins pour ne pas faire la salope devant Thomas."
  },
  {
    name: "Thomas",
    slug: "thomas",
    description: "Homme qui s’engage sur les 12 travaux d’Hercule avec un bébé, un concours, une femme et un 35 h. Capable de porter lourd, courir longtemps, avoir des abdos, mais ne comprend pas le second degré et est incapable de mettre des PR en vert."
  },
  {
    name: "Yanice",
    slug: "yanice",
    description: "DZ qui mange du quinoa avec de la sauce boulgour depuis début janvier. Anomalie physique, monstrueux en crossfit, porte très lourd mais n’est pas capable de courir 150 m ni de suivre une conversation sur WhatsApp. Chacun son combat."
  },
  {
    name: "Yannis",
    slug: "yannis",
    description: "Homme le plus petit en taille mais le plus grand en messages WhatsApp d’entraînement. Super complet. T’envoie des exercices qui ne sont pas encore inventés. Capable de rester 6 h à la salle mais pas capable de regarder la couleur rose plus de 7 secondes."
  },
  {
    name: "Enzo",
    slug: "enzo",
    description: "Homme le plus fort et le plus endurant du groupe, mange sainement, bon rythme de sommeil, équilibre parfait, un sans-faute, ne valide pas les objectifs pour ne pas frustrer les copains. Un grand homme."
  }
]


goals_by_slug = {
  "yannis" => [
    "Poids: Être à 67 kilos",
    "Musculation: Passer 12 Muscle Up",
    "Musculation: Développé couché à 100 kilos",
    "Course: Courir le semi-marathon (21km) en 1h40"
  ],
  "xavier" => [
    "Musculation: Squat à 150 kilos",
    "Musculation: Développé couché à 150 kilos",
    "Course: 10km en sub 41",
    "Course: Semi-marathon en sub 1h40",
    "Poids: Descendre sous les 86 kilos"
  ],
  "thomas" => [
    "Musculation: Squat à 110 kilos",
    "Musculation: Faire 5 Muscle Up lestés à +10 kilos",
    "Musculation: Soulever 170 kilos au deadlift",
    "Course: 21Km sub 1h32",
    "Poids: Descendre sous les 80 kilos"
  ],
  "yanice" => [
    "Musculation: Passer 10 Muscle Up",
    "Musculation: Passer 10 Ring Muscle Up",
    "Poids: Être à 76 kilos",
    "Course: 10km en 49 minutes"
  ],
  "enzo" => [
    "Course: 10km en sub 55",
    "Course: 21km en sub 2h",
    "Musculation: Passer 5 Muscle Up",
    "Musculation: Développé couché à 100 kilos",
    "Musculation: Soulever 140 kilos au deadlift",
    "Musculation: Soulever 100 kilos au squat",
    "Poids: Descendre sous les 79 kilos"
  ]
}.freeze

people_data.each do |person_data|
  person = Person.find_or_create_by!(slug: person_data[:slug]) do |p|
    p.name = person_data[:name]
    p.description = person_data[:description]
  end

  person.update!(name: person_data[:name], description: person_data[:description])

  goals = goals_by_slug.fetch(person.slug)
  valid_positions = (1..goals.length).to_a
  person.goals.where.not(position: valid_positions).destroy_all

  goals.each_with_index do |title, index|
    position = index + 1
    goal = person.goals.find_or_initialize_by(position: position)
    goal.title = title
    goal.completed = false
    goal.save!
  end

  if person.personal_records.count < 2
    person.personal_records.find_or_create_by!(
      category: "musculation",
      performed_on: Date.new(2026, 1, 15),
      description: "Exemple PR musculation"
    )

    person.personal_records.find_or_create_by!(
      category: "course",
      performed_on: Date.new(2026, 1, 20),
      description: "Exemple PR course"
    )
  end
end

puts "Seeds completed: #{Person.count} people, #{Goal.count} goals, #{PersonalRecord.count} personal records."
