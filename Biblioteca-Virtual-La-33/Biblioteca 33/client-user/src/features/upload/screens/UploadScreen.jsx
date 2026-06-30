// client-user/src/features/upload/screens/UploadScreen.jsx
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUpload } from '../hooks/useUpload.js';
import { SubjectPicker } from '../../materials/components/SubjectPicker.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Input } from '../../../shared/components/common/Input.jsx';
import { LoadingSpinner, Card } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme.js';
import { formatDate, getSubjectName, STATUS_LABELS } from '../../../utils/formatters.js';

const STATUS_COLORS = {
  pending: COLORS.warning,
  approved: COLORS.success,
  rejected: COLORS.error,
};

export const UploadScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    subjects,
    myFiles,
    pickedFile,
    loading,
    uploading,
    error,
    fetchSubjects,
    fetchMyFiles,
    pickDocument,
    uploadMaterial,
    clearPickedFile,
  } = useUpload();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [formError, setFormError] = useState(null);

  const load = useCallback(() => {
    fetchSubjects();
    fetchMyFiles();
  }, [fetchSubjects, fetchMyFiles]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePick = async () => {
    await pickDocument();
  };

  const handleUpload = async () => {
    setFormError(null);

    if (!title.trim()) {
      setFormError('El título es obligatorio');
      return;
    }
    if (!subject) {
      setFormError('Selecciona una asignatura');
      return;
    }
    if (!pickedFile) {
      setFormError('Selecciona un archivo');
      return;
    }

    const result = await uploadMaterial({
      title,
      description,
      subject,
    });

    if (result.success) {
      setTitle('');
      setDescription('');
      setSubject('');
      Alert.alert('Éxito', 'Tu material fue enviado y está pendiente de revisión.');
    } else if (result.error) {
      setFormError(result.error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.md }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={load} tintColor={COLORS.primary} />
      }
    >
      <Text style={styles.title}>Gestor de Cargas</Text>
      <Text style={styles.subtitle}>Sube documentos a la biblioteca virtual</Text>

      {(error || formError) ? (
        <Text style={styles.error}>{formError || error}</Text>
      ) : null}

      <Card style={styles.formCard}>
        <Input
          label="Título"
          placeholder="Nombre del recurso"
          value={title}
          onChangeText={setTitle}
        />
        <View style={styles.fieldGap} />
        <SubjectPicker
          label="Asignatura"
          subjects={subjects}
          value={subject}
          onChange={setSubject}
          allowEmpty={false}
          placeholder="Seleccionar asignatura"
        />
        <View style={styles.fieldGap} />
        <Input
          label="Descripción"
          placeholder="Describe el contenido del archivo"
          value={description}
          onChangeText={setDescription}
          multiline
          inputStyle={styles.textArea}
        />
        <View style={styles.fieldGap} />

        <Button
          title={pickedFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
          variant="secondary"
          onPress={handlePick}
        />

        {pickedFile ? (
          <View style={styles.fileRow}>
            <MaterialIcons name="attach-file" size={20} color={COLORS.primary} />
            <Text style={styles.fileName} numberOfLines={1}>
              {pickedFile.name}
            </Text>
            <Button title="Quitar" variant="secondary" onPress={clearPickedFile} style={styles.removeBtn} textStyle={styles.removeBtnText} />
          </View>
        ) : null}

        <Button
          title="Finalizar y Subir"
          onPress={handleUpload}
          loading={uploading}
          style={styles.uploadBtn}
        />
      </Card>

      <Text style={styles.sectionTitle}>Mis Cargas Recientes</Text>

      {loading && myFiles.length === 0 ? (
        <LoadingSpinner message="Cargando tus cargas..." />
      ) : myFiles.length === 0 ? (
        <Text style={styles.emptyHint}>Aún no has subido materiales.</Text>
      ) : (
        myFiles.map((file) => {
          const status = file.status || 'pending';
          const badgeColor = STATUS_COLORS[status] || COLORS.textLight;
          return (
            <Card key={file._id || file.id} style={styles.uploadCard}>
              <View style={styles.uploadHeader}>
                <Text style={styles.uploadTitle} numberOfLines={1}>
                  {file.title || file.originalName || 'Sin título'}
                </Text>
                <View style={[styles.statusBadge, { borderColor: badgeColor }]}>
                  <Text style={[styles.statusText, { color: badgeColor }]}>
                    {STATUS_LABELS[status] || status}
                  </Text>
                </View>
              </View>
              <Text style={styles.uploadMeta}>{getSubjectName(file)}</Text>
              <Text style={styles.uploadDate}>{formatDate(file.createdAt)}</Text>
            </Card>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.lg,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
  },
  formCard: {
    marginBottom: SPACING.xl,
  },
  fieldGap: {
    height: SPACING.md,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
  },
  fileName: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
  },
  removeBtn: {
    minHeight: 36,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  removeBtnText: {
    fontSize: FONT_SIZE.xs,
  },
  uploadBtn: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  emptyHint: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
  },
  uploadCard: {
    marginBottom: SPACING.md,
  },
  uploadHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  uploadTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  uploadMeta: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
    marginBottom: 2,
  },
  uploadDate: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.xs,
  },
});
