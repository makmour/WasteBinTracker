import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const binSurveyEntries = pgTable("bin_survey_entries", {
  id: serial("id").primaryKey(),
  datetime: timestamp("datetime").notNull().defaultNow(),
  municipality: text("municipality").notNull().default("Glyfada"),
  street: text("street").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  binTypes: text("bin_types").array().notNull(),
  quantity: integer("quantity").notNull(),
  photoUri: text("photo_uri"),
  comments: text("comments"),
  synced: boolean("synced").notNull().default(false),
});

export const insertBinSurveyEntrySchema = createInsertSchema(binSurveyEntries).omit({
  id: true,
  datetime: true,
  synced: true,
});

export type InsertBinSurveyEntry = z.infer<typeof insertBinSurveyEntrySchema>;
export type BinSurveyEntry = typeof binSurveyEntries.$inferSelect;

// Predefined streets for Glyfada Municipality
export const GLYFADA_STREETS = [
  "Achilleos",
  "Adikithiron", 
  "Agamemnonos",
  "Agias Lavras",
  "Agias Triados",
  "Agias Varvaras",
  "Agiou Fanouriou",
  "Agiou Gerassimou",
  "Agiou Ioanni",
  "Agiou Konstadinou",
  "Agiou Mina",
  "Agiou Nektariou",
  "Agiou Nikolaou Avenue",
  "Agiou Pavlou",
  "Agiou Trifonos",
  "Agiou Vassiliou",
  "Agissilaou",
  "Agriniou",
  "Aidiniou",
  "Akrokorinthou",
  "Akrotiriou",
  "Alkiviadou",
  "Alon",
  "Alonnissou",
  "Alsous",
  "Amerikis",
  "Amfissis",
  "Ammochostou",
  "Amorgou",
  "Anafis",
  "Analipseos",
  "Anatolikis Romilias",
  "Anaxagora",
  "Androutsou Odissea",
  "Antheon",
  "Apo Anatolis",
  "Apollonos",
  "Arachthou",
  "Archimidous",
  "Archipelagous",
  "Aretis",
  "Argirokastrou",
  "Argous",
  "Aristidou",
  "Aristippou",
  "Aristofanous",
  "Aristomenous",
  "Aristotelous",
  "Arkadias",
  "Artemidos",
  "Artemissiou",
  "Artis",
  "Asklipiou",
  "Astipaleas",
  "Athanatou Konstadinou Avenue",
  "Athonos",
  "Attikis",
  "Avlonas",
  "Avras",
  "Azofikis",
  "Bakogianni Pavlou",
  "Botsari Markou",
  "Bouboulinas",
  "Bournova",
  "Chalkis",
  "Chanion",
  "Chimarras",
  "Chiou",
  "Choras",
  "Chrissostomou Smirnis",
  "Dardanellion",
  "Daskalogianni",
  "Daskaroli",
  "Davaki",
  "Delfon",
  "Dervenakion",
  "Despoti Karavassili",
  "Diadochou Pavlou",
  "Diakou Athanassiou",
  "Dikeossinis",
  "Dilinon",
  "Dilou",
  "Dimela Manoli",
  "Dimokratias",
  "Dimosthenis",
  "Dionissiou",
  "Doiranis",
  "Doukissis Plakentias",
  "Doxapatri",
  "Dragoumi",
  "Egnatias",
  "Eirinis",
  "Eleftheriou Venizelou",
  "Elenis",
  "Ellinidos",
  "Ermoupolis",
  "Esperidon",
  "Etolias",
  "Evaggelistrias",
  "Evrou",
  "Filellinon",
  "Flisvou",
  "Fokidos",
  "Fotila",
  "Frangiska",
  "Galanis",
  "Galinis",
  "Garibaldi",
  "Gennimata",
  "Georgiou",
  "Gkolemi",
  "Gounari",
  "Gregorias",
  "Grigoriou Lambraki",
  "Iassiou",
  "Ikarias",
  "Iliados",
  "Ionos",
  "Ippokratous",
  "Ithakis",
  "Kalamatas",
  "Kalimnos",
  "Kalogera",
  "Kanari",
  "Kapodistrias",
  "Karpenissiou",
  "Karyatides",
  "Kassandras",
  "Konstantinou Karamanli",
  "Korinthou",
  "Kornilia",
  "Koumoundourou",
  "Kriti",
  "Kyprou",
  "Kyrillos",
  "Laodikis",
  "Laskareos",
  "Lazaraki",
  "Leoforos Metaxa",
  "Leoforos Vouliagmenis",
  "Lesvou",
  "Lidorikiou",
  "Livadias",
  "Loukianou",
  "Lykavitou",
  "Makrigianni",
  "Mantinias",
  "Markou Mpotsari",
  "Megalou Alexandrou",
  "Messinias",
  "Metaxa",
  "Miaouli",
  "Mikras Asias",
  "Militiadou",
  "Mirson",
  "Monastiraki",
  "Moreas",
  "Navarinou",
  "Nikis",
  "Odyssea",
  "Olympiados",
  "Orestou",
  "Panagi Tsaldari",
  "Papadiamandopoulou",
  "Papanastasiou",
  "Paraskevopoulos",
  "Paros",
  "Patriarchou Gregoriou",
  "Poseidonos",
  "Rigillis",
  "Salaminos",
  "Samou",
  "Seirinon",
  "Sivitanidou",
  "Solomou",
  "Spartis",
  "Stavrou",
  "Stratigou Kallari",
  "Stratigou Kontouli",
  "Syggrou",
  "Terpandrou",
  "Themistokleous",
  "Thessalias",
  "Thessalonikis",
  "Thiras",
  "Thivon",
  "Tinou",
  "Tsimiski",
  "Valaoritou",
  "Vassileos Konstantinou",
  "Vassileos Pavlou",
  "Vatatzi",
  "Veikou",
  "Xenofontos",
  "Ypsilantou",
  "Zakinthou",
  "Zisimopoulou"
] as const;

// Municipality data with basic coordinates for Glyfada
export const MUNICIPALITIES = [
  {
    name: "Glyfada",
    latitude: 37.8667,
    longitude: 23.7667,
    streets: GLYFADA_STREETS
  }
] as const;

export const BIN_TYPES = ["Green", "Blue", "Brown", "Yellow"] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
