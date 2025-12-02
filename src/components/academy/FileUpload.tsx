"use client";

import { useCallback, useState } from "react";
import { Box, VStack, Text, Icon, Button, HStack, List, ListItem, ListIcon } from "@chakra-ui/react";
import { FaCloudUploadAlt, FaFile, FaTimes, FaCheckCircle } from "react-icons/fa";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
}

export default function FileUpload({
  onFileSelect,
  acceptedFileTypes = [".pdf", ".zip", ".rar", ".7z", ".doc", ".docx"],
  maxFiles = 5,
  maxSizePerFile = 10,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const fileErrors: string[] = [];

    files.forEach((file) => {
      // Check file type
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedFileTypes.includes(fileExtension)) {
        fileErrors.push(`${file.name}: Invalid file type`);
        return;
      }

      // Check file size
      if (file.size > maxSizePerFile * 1024 * 1024) {
        fileErrors.push(`${file.name}: File size exceeds ${maxSizePerFile}MB`);
        return;
      }

      validFiles.push(file);
    });

    // Check total files count
    if (selectedFiles.length + validFiles.length > maxFiles) {
      fileErrors.push(`Maximum ${maxFiles} files allowed`);
      return { valid: [], errors: fileErrors };
    }

    return { valid: validFiles, errors: fileErrors };
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const { valid, errors: validationErrors } = validateFiles(fileArray);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newFiles = [...selectedFiles, ...valid];
    setSelectedFiles(newFiles);
    setErrors([]);
    onFileSelect(newFiles);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [selectedFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <VStack spacing="4" align="stretch">
      {/* Drop Zone */}
      <Box
        position="relative"
        border="2px dashed"
        borderColor={dragActive ? "blue.500" : "gray.300"}
        _dark={{ borderColor: dragActive ? "blue.400" : "gray.600" }}
        borderRadius="lg"
        p="8"
        textAlign="center"
        bg={dragActive ? "blue.50" : "gray.50"}
        _dark={{ bg: dragActive ? "blue.900" : "gray.800" }}
        transition="all 0.3s"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept={acceptedFileTypes.join(",")}
          onChange={handleChange}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            opacity: 0,
            cursor: "pointer",
          }}
        />
        <VStack spacing="3">
          <Icon as={FaCloudUploadAlt} boxSize="48px" color="blue.500" />
          <Text fontWeight="bold" fontSize="lg">
            Drop files here or click to browse
          </Text>
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            Accepted: {acceptedFileTypes.join(", ")}
          </Text>
          <Text fontSize="xs" color="gray.500">
            Max {maxFiles} files, {maxSizePerFile}MB each
          </Text>
        </VStack>
      </Box>

      {/* Errors */}
      {errors.length > 0 && (
        <Box
          bg="red.50"
          _dark={{ bg: "red.900" }}
          borderRadius="md"
          p="3"
          borderLeft="4px solid"
          borderColor="red.500"
        >
          <List spacing="1">
            {errors.map((error, index) => (
              <ListItem key={index} fontSize="sm" color="red.600" _dark={{ color: "red.300" }}>
                <ListIcon as={FaTimes} />
                {error}
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <VStack align="stretch" spacing="2">
          <Text fontWeight="semibold" fontSize="sm">
            Selected Files ({selectedFiles.length}/{maxFiles})
          </Text>
          {selectedFiles.map((file, index) => (
            <HStack
              key={index}
              p="3"
              bg="white"
              _dark={{ bg: "gray.700" }}
              borderRadius="md"
              justify="space-between"
              borderWidth="1px"
              borderColor="gray.200"
              _dark={{ borderColor: "gray.600" }}
            >
              <HStack spacing="3" flex="1">
                <Icon as={FaFile} color="blue.500" />
                <VStack align="start" spacing="0">
                  <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                    {file.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {formatFileSize(file.size)}
                  </Text>
                </VStack>
              </HStack>
              <HStack spacing="2">
                <Icon as={FaCheckCircle} color="green.500" />
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                >
                  Remove
                </Button>
              </HStack>
            </HStack>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
