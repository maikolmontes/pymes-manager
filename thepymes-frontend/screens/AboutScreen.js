import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Icon name="earth" size={34} color="#2196F3" />
          <Text style={styles.title}>Tecnología con propósito local</Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.text}>
          Nuestra filosofía se basa en que la tecnología debe empoderar a las comunidades.
          No replicamos modelos de gigantes tecnológicos, sino que visibilizamos lo invisible: los micronegocios.
        </Text>

        <Section
          icon="handshake"
          title="Nuestros valores:"
          content={[
            'Inclusión digital: acceso para todos, sin importar el nivel tecnológico.',
            'Autonomía local: las comunidades lideran su desarrollo.',
            'Transparencia y ética: enfoque social y responsable.',
            'Colaboración activa: trabajamos con gobiernos, universidades y colectivos.',
          ]}
        />

        <Section
          icon="star-circle"
          title="¿Qué nos diferencia?"
          content={[
            'Foco en micronegocios invisibles para grandes plataformas.',
            'Modelo colaborativo con participación ciudadana.',
            'Rutas inteligentes basadas en comercio local.',
            'Enfoque social antes que comercial.',
            'Interfaz simple para usuarios con poca experiencia digital.',
          ]}
        />

        <Section
          icon="account-group"
          title="Sobre Nosotros"
          content={[
            'Somos una empresa tecnológica con propósito social. Creamos un mapa como Google Maps, pero para tiendas de barrio, vendedores ambulantes y emprendedores locales.',
            'Nuestro mapa muestra personas, historias y oportunidades, no solo rutas.',
          ]}
        />

        <Section
          icon="rocket-launch"
          title="¿Qué nos mueve?"
          content={[
            'Impulsar la economía popular.',
            'Reducir la brecha digital.',
            'Fortalecer la identidad local.',
            'Conectar comunidades y emprendedores.',
          ]}
        />

        <Section
          icon="heart-multiple"
          title="Nuestra Causa"
          content={[
            'Hacemos visibles a los invisibles. En cada barrio hay negocios fuera del radar digital. Nosotros los ponemos en el mapa.',
            'No somos una app más. Somos un movimiento por la visibilidad, inclusión y economía con rostro humano.',
          ]}
        />

        <Section
          icon="map-marker-plus"
          title="¿Quieres sumarte?"
          content={[
            'Registra tu negocio o el de tu comunidad.',
            'Construyamos juntos un mapa más justo, humano y local.',
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente reutilizable para secciones
function Section({ icon, title, content }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={24} color="#2196F3" style={{ marginRight: 8 }} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {content.map((item, index) => (
        <Text key={index} style={styles.text}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196F3',
    marginLeft: 10,
  },
  separator: {
    height: 2,
    backgroundColor: '#2196F3',
    width: '30%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#000',
  },
  text: {
    fontSize: width * 0.043,
    lineHeight: 24,
    textAlign: 'justify',
    color: '#444',
    marginBottom: 6,
  },
});
