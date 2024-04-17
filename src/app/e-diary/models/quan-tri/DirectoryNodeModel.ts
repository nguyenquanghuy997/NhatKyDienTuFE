export interface DirectoryNodeModel {
  Name: string;
  Path: string;
  isDirectory: boolean;
  SubNode?: DirectoryNodeModel[];
}

export interface FileSystemItem {
  Name: string | undefined;
  Path: string | undefined;
  IsDirectory: boolean | undefined;
  Children: FileSystemItem[] | undefined;
  IsCollapse: boolean;
}
